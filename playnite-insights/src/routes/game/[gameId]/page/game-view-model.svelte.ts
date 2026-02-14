import type { ScoreBreakdown } from "$lib/modules/game-library/domain";
import { m } from "$lib/paraglide/messages";
import { CLASSIFICATION_IDS, type ClassificationId } from "@playatlas/common/domain";
import { SvelteMap } from "svelte/reactivity";
import type { GameAggregateStore } from "./game-aggregate-store.svelte";

type GameViewModelDeps = {
	gameAggregateStore: GameAggregateStore;
};

type EvidenceGroupBreakdown = {
	score: number;
	groups: ScoreBreakdown["groups"];
};

type EngineEntry = {
	classificationId: ClassificationId;
	score: number;
	groups: ScoreBreakdown["groups"];
};

export class GameViewModel {
	private store: GameAggregateStore;
	#evidenceGroupBreakdownByClassificationId: Map<ClassificationId, EvidenceGroupBreakdown>;
	#strongestClassificationsSignal: ClassificationId[];
	#strongestClassificationsLabelSignal: string[];

	constructor({ gameAggregateStore }: GameViewModelDeps) {
		this.store = gameAggregateStore;

		this.#evidenceGroupBreakdownByClassificationId = $derived.by(() => {
			const gameClassificationsByClassificationId = gameAggregateStore.gameClassifications;

			if (!gameClassificationsByClassificationId) return new SvelteMap();

			const entries: EngineEntry[] = [];

			for (const classificationId of CLASSIFICATION_IDS) {
				const gameClassifications = gameClassificationsByClassificationId
					.get(classificationId)
					?.values()
					.toArray();
				const latestGameClassification = gameClassifications?.at(0);

				if (!latestGameClassification) continue;
				if (latestGameClassification.Breakdown.type !== "normalized") continue;

				entries.push({
					classificationId,
					score: latestGameClassification.NormalizedScore,
					groups: latestGameClassification.Breakdown.breakdown.groups,
				});
			}

			entries.sort((a, b) => {
				const scoreDiff = b.score - a.score;
				if (scoreDiff !== 0) return scoreDiff;
				else return a.classificationId.localeCompare(b.classificationId);
			});

			const evidenceGroups = new SvelteMap<ClassificationId, EvidenceGroupBreakdown>();

			for (const entry of entries) {
				evidenceGroups.set(entry.classificationId, { groups: entry.groups, score: entry.score });
			}

			return evidenceGroups;
		});

		this.#strongestClassificationsSignal = $derived.by(() => {
			const groupsMeta = this.#evidenceGroupBreakdownByClassificationId;
			const highestScore = [...groupsMeta.values()].at(0)?.score ?? 0;
			const strongestClassifications: ClassificationId[] = [];

			for (const [classificationId, evidenceGroupMeta] of groupsMeta) {
				if (evidenceGroupMeta.score <= 0.4) continue;
				if (
					evidenceGroupMeta.score === highestScore ||
					evidenceGroupMeta.score >= highestScore * 0.75
				)
					strongestClassifications.push(classificationId);
			}

			return strongestClassifications;
		});

		this.#strongestClassificationsLabelSignal = $derived.by(() => {
			const labels: string[] = [];

			for (const classification of this.#strongestClassificationsSignal) {
				switch (classification) {
					case "HORROR":
						labels.push(m["score_engine.HORROR.engineLabel"]());
						break;
					case "RUN-BASED":
						labels.push(m["score_engine.RUN-BASED.engineLabel"]());
						break;
					default:
						break;
				}
			}

			return labels;
		});
	}

	get evidenceGroupsSignal(): Map<ClassificationId, EvidenceGroupBreakdown> {
		return this.#evidenceGroupBreakdownByClassificationId;
	}

	get strongestClassificationsLabelSignal(): string[] {
		return this.#strongestClassificationsLabelSignal;
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
