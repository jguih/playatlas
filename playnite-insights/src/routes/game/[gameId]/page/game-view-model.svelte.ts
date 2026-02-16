import type { GameClassification } from "$lib/modules/game-library/domain";
import { type ClassificationId } from "@playatlas/common/domain";
import { SvelteMap } from "svelte/reactivity";
import type { GameAggregateStore } from "./game-aggregate-store.svelte";
import {
	getScoreEngineGroupDetails,
	getScoreEngineLabel,
	type EvidenceGroupMeta,
} from "./score-engine-registry";

type GameViewModelDeps = {
	gameAggregateStore: GameAggregateStore;
};

type EvidenceGroupDetails = EvidenceGroupMeta & {
	visible: boolean;
};

export class GameViewModel {
	/**
	 * To consider classifications which total score was equal or higher than this threshold.
	 */
	private STRONGEST_CLASSIFICATIONS_MIN_SCORE = 0.3 as const;
	private CLASSIFICATIONS_BREAKDOWN_MIN_SCORE = 0.1 as const;

	private store: GameAggregateStore;
	private gameClassificationsOrderedByStrongest: SvelteMap<ClassificationId, GameClassification>;
	strongestClassificationsLabelSignal: string[];
	classificationsBreakdownSignal: SvelteMap<ClassificationId, EvidenceGroupDetails[]>;

	constructor({ gameAggregateStore }: GameViewModelDeps) {
		this.store = gameAggregateStore;

		this.gameClassificationsOrderedByStrongest = $derived.by(() => {
			const gameClassifications = gameAggregateStore.latestGameClassifications;
			const entries: Array<{ classificationId: ClassificationId } & GameClassification> = [];

			for (const [classificationId, gameClassification] of gameClassifications) {
				entries.push({ classificationId, ...gameClassification });
			}

			entries.sort((a, b) => {
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
				if (gameClassification.NormalizedScore <= this.STRONGEST_CLASSIFICATIONS_MIN_SCORE)
					continue;
				labels.push(getScoreEngineLabel(classificationId));
			}

			return labels;
		});

		this.classificationsBreakdownSignal = $derived.by(() => {
			const gameClassifications = this.gameClassificationsOrderedByStrongest;
			const evidenceGroupDetailsByClassification = new SvelteMap<
				ClassificationId,
				EvidenceGroupDetails[]
			>();

			for (const [classificationId, gameClassification] of gameClassifications) {
				if (gameClassification.NormalizedScore < this.CLASSIFICATIONS_BREAKDOWN_MIN_SCORE) continue;

				const groupsMeta = gameClassification.EvidenceGroupMeta;
				const groupDetails = getScoreEngineGroupDetails(classificationId);

				if (!groupsMeta) continue;
				if (gameClassification.Breakdown.type !== "normalized") continue;

				const breakdownGroupDetails: Array<{ name: string; visible: boolean }> = [];

				for (const group of gameClassification.Breakdown.breakdown.groups) {
					const groupName = group.group;
					breakdownGroupDetails.push({
						name: groupName,
						visible: groupsMeta[groupName].userFacing,
					});
				}

				for (const breakdownGroupDetail of breakdownGroupDetails) {
					const groupName = breakdownGroupDetail.name;
					if (!(groupName in groupDetails)) continue;
					const details = groupDetails[groupName as keyof typeof groupDetails] as EvidenceGroupMeta;

					let evidenceGroupDetails = evidenceGroupDetailsByClassification.get(classificationId);
					if (!evidenceGroupDetails) {
						evidenceGroupDetails = [];
						evidenceGroupDetailsByClassification.set(classificationId, evidenceGroupDetails);
					}
					evidenceGroupDetails.push({ ...details, visible: breakdownGroupDetail.visible });
				}
			}

			return evidenceGroupDetailsByClassification;
		});
	}

	get developersStringSignal(): string {
		if (this.store.developers.length === 0) return "";
		return this.store.developers.map((d) => d.Name).join(", ");
	}

	get publishersStringSignal(): string {
		if (this.store.publishers.length === 0) return "";
		return this.store.publishers.map((d) => d.Name).join(", ");
	}
}
