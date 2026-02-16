import type { GameClassification, ScoreBreakdown } from "$lib/modules/game-library/domain";
import {
	canonicalClassificationTiers,
	type CanonicalClassificationTier,
	type ClassificationId,
} from "@playatlas/common/domain";
import { SvelteMap } from "svelte/reactivity";
import type { GameAggregateStore } from "./game-aggregate-store.svelte";
import {
	classificationTierRegistry,
	evidenceGroupTierRegistry,
	getScoreEngineGroupDetails,
	getScoreEngineLabel,
	scoreEngineRegistry,
	type EvidenceGroupMeta,
	type EvidenceGroupTier,
	type ScoreEngineMeta,
} from "./score-engine-registry";

type GameViewModelDeps = {
	gameAggregateStore: GameAggregateStore;
};

type EvidenceGroupDetails = EvidenceGroupMeta & {
	visible: boolean;
	rawTier: EvidenceGroupTier;
	tierLabel: () => string;
};

export type ClassificationsBreakdownMap = SvelteMap<
	ClassificationId,
	{
		groupDetails: EvidenceGroupDetails[];
		rawTier: CanonicalClassificationTier;
		tierLabel: () => string;
	} & ScoreEngineMeta
>;

export class GameViewModel {
	/**
	 * To consider classifications which total score was equal or higher than this threshold.
	 */
	private STRONGEST_CLASSIFICATIONS_MIN_SCORE = 0.2 as const;
	private CLASSIFICATIONS_BREAKDOWN_MIN_SCORE = 0.1 as const;
	private STRONGEST_CLASSIFICATIONS_EXCLUDED_TIERS: CanonicalClassificationTier[] = [
		"none",
		"weak",
	] as const;
	private CLASSIFICATIONS_BREAKDOWN_EXCLUDED_TIERS: CanonicalClassificationTier[] = [
		"none",
	] as const;

	private store: GameAggregateStore;
	private gameClassificationsOrderedByStrongest: SvelteMap<ClassificationId, GameClassification>;
	strongestClassificationsLabelSignal: string[];
	classificationsBreakdownSignal: ClassificationsBreakdownMap;

	constructor({ gameAggregateStore }: GameViewModelDeps) {
		this.store = gameAggregateStore;

		this.gameClassificationsOrderedByStrongest = $derived.by(() => {
			const gameClassifications = gameAggregateStore.latestGameClassifications;
			const entries: Array<{ classificationId: ClassificationId } & GameClassification> = [];

			for (const [classificationId, gameClassification] of gameClassifications) {
				entries.push({ classificationId, ...gameClassification });
			}

			entries.sort((a, b) => {
				const breakdownA = a.Breakdown.type === "normalized" ? a.Breakdown.breakdown : null;
				const breakdownB = b.Breakdown.type === "normalized" ? b.Breakdown.breakdown : null;

				// Order by greatest tier descending first
				if (breakdownA && breakdownB) {
					const indexA = canonicalClassificationTiers.indexOf(breakdownA.tier);
					const indexB = canonicalClassificationTiers.indexOf(breakdownB.tier);
					if (indexA < indexB) return 1;
					if (indexB > indexA) return -1;
					return 0;
				}

				// Fallback to by greatest score ascending
				const diff = b.Score - a.Score;
				if (diff !== 0) return diff;
				return b.Id.localeCompare(a.Id);
			});

			return new SvelteMap(entries.map((e) => [e.classificationId, e]));
		});

		this.strongestClassificationsLabelSignal = $derived.by(() => {
			const gameClassifications = this.gameClassificationsOrderedByStrongest;
			const labels: string[] = [];

			for (const [classificationId, gameClassification] of gameClassifications) {
				if (this.shouldSkipGameClassification(gameClassification, "strongest")) continue;
				labels.push(getScoreEngineLabel(classificationId));
			}

			return labels;
		});

		this.classificationsBreakdownSignal = $derived.by(() => {
			const gameClassifications = this.gameClassificationsOrderedByStrongest;
			const evidenceGroupDetailsByClassification: ClassificationsBreakdownMap = new SvelteMap();

			// `gameClassifications.keys()` used to preserve original order (by strongest DESC)
			for (const classificationId of gameClassifications.keys()) {
				const gameClassification = gameClassifications.get(classificationId);

				if (!gameClassification) continue;

				if (this.shouldSkipGameClassification(gameClassification, "breakdown")) continue;

				const engineLabel = scoreEngineRegistry[classificationId].engineLabel;
				const engineDescription = scoreEngineRegistry[classificationId].engineDescription;
				evidenceGroupDetailsByClassification.set(classificationId, {
					groupDetails: [],
					engineDescription,
					engineLabel,
					rawTier: "none",
					tierLabel: classificationTierRegistry.none,
				});
			}

			for (const [classificationId, gameClassification] of gameClassifications) {
				const groupsMeta = gameClassification.EvidenceGroupMeta;
				const groupDetails = getScoreEngineGroupDetails(classificationId);
				const evidenceGroupDetails = evidenceGroupDetailsByClassification.get(classificationId);

				if (gameClassification.Breakdown.type !== "normalized") continue;
				if (!evidenceGroupDetails) continue;
				if (!groupsMeta) continue;

				const breakdown = gameClassification.Breakdown.breakdown;

				evidenceGroupDetails.rawTier = breakdown.tier;
				evidenceGroupDetails.tierLabel = classificationTierRegistry[breakdown.tier];

				const breakdownGroupDetails: Array<{
					name: string;
					visible: boolean;
					tier: EvidenceGroupTier;
				}> = [];

				for (const group of breakdown.groups) {
					if (group.contribution === 0) continue;

					const groupName = group.group;
					breakdownGroupDetails.push({
						name: groupName,
						visible: groupsMeta[groupName].userFacing,
						tier: this.computeEvidenceGroupTier(group),
					});
				}

				for (const breakdownGroupDetail of breakdownGroupDetails) {
					const groupName = breakdownGroupDetail.name;

					if (!(groupName in groupDetails)) continue;

					const details = groupDetails[groupName as keyof typeof groupDetails] as EvidenceGroupMeta;

					evidenceGroupDetails.groupDetails.push({
						...details,
						visible: breakdownGroupDetail.visible,
						rawTier: breakdownGroupDetail.tier,
						tierLabel: evidenceGroupTierRegistry[breakdownGroupDetail.tier],
					});
				}
			}

			return evidenceGroupDetailsByClassification;
		});
	}

	private shouldSkipGameClassification = (
		gameClassification: GameClassification,
		mode: "strongest" | "breakdown",
	): boolean => {
		const breakdown =
			gameClassification.Breakdown.type === "normalized"
				? gameClassification.Breakdown.breakdown
				: null;
		const excludedTiers =
			mode === "strongest"
				? this.STRONGEST_CLASSIFICATIONS_EXCLUDED_TIERS
				: this.CLASSIFICATIONS_BREAKDOWN_EXCLUDED_TIERS;
		const minScore =
			mode === "strongest"
				? this.STRONGEST_CLASSIFICATIONS_MIN_SCORE
				: this.CLASSIFICATIONS_BREAKDOWN_MIN_SCORE;

		if (breakdown && excludedTiers.includes(breakdown.tier)) return true;
		else if (!breakdown && gameClassification.NormalizedScore <= minScore) return true;
		return false;
	};

	private computeEvidenceGroupTier = (
		group: ScoreBreakdown["groups"][number],
	): EvidenceGroupTier => {
		if (group.contributionPercent === 0) return "none";
		if (group.contributionPercent >= 0.5) return "strong";
		if (group.contribution >= 0.2) return "moderate";
		return "light";
	};

	get developersStringSignal(): string {
		if (this.store.developers.length === 0) return "";
		return this.store.developers.map((d) => d.Name).join(", ");
	}

	get publishersStringSignal(): string {
		if (this.store.publishers.length === 0) return "";
		return this.store.publishers.map((d) => d.Name).join(", ");
	}
}
