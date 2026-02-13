import { m } from "$lib/paraglide/messages";
import { CLASSIFICATION_IDS, type ClassificationId } from "@playatlas/common/domain";
import { SvelteMap } from "svelte/reactivity";
import type { GameAggregateStore } from "./game-aggregate-store.svelte";

type GameViewModelDeps = {
	gameAggregateStore: GameAggregateStore;
};

type EvidenceGroupMeta = {
	name: string;
};

type EngineEntry = {
	classificationId: ClassificationId;
	score: number;
	groups: EvidenceGroupMeta[];
};

export class GameViewModel {
	private store: GameAggregateStore;
	#evidenceGroupsSignal: Map<ClassificationId, EvidenceGroupMeta[]>;
	#highestClassificationSignal: ClassificationId | null;

	constructor({ gameAggregateStore }: GameViewModelDeps) {
		this.store = gameAggregateStore;

		this.#evidenceGroupsSignal = $derived.by(() => {
			const gameClassificationsByClassificationId = gameAggregateStore.gameClassifications;

			if (!gameClassificationsByClassificationId) return new SvelteMap();

			const entries: EngineEntry[] = [];

			for (const classificationId of CLASSIFICATION_IDS) {
				const gameClassifications = gameClassificationsByClassificationId
					.get(classificationId)
					?.values()
					.toArray();
				const latestGameClassification = gameClassifications?.at(0);
				const groupMeta = latestGameClassification?.EvidenceGroupMeta;

				if (!latestGameClassification) continue;
				if (latestGameClassification.Breakdown.type !== "normalized") continue;
				if (!groupMeta) continue;

				const groups: EvidenceGroupMeta[] = [];
				const groupsThatScored = latestGameClassification.Breakdown.breakdown.groups.map(
					(g) => g.group,
				);

				for (const groupName of groupsThatScored) {
					if (!groupMeta[groupName].userFacing) continue;
					groups.push({ name: groupName });
				}

				entries.push({
					classificationId,
					score: latestGameClassification.NormalizedScore,
					groups,
				});
			}

			entries.sort((a, b) => {
				const scoreDiff = b.score - a.score;
				if (scoreDiff !== 0) return scoreDiff;
				else return a.classificationId.localeCompare(b.classificationId);
			});

			const evidenceGroups = new SvelteMap<ClassificationId, EvidenceGroupMeta[]>();

			for (const entry of entries) {
				evidenceGroups.set(entry.classificationId, entry.groups);
			}

			return evidenceGroups;
		});

		this.#highestClassificationSignal = $derived.by(() => {
			const evidenceGroups = this.#evidenceGroupsSignal;
			for (const [classificationId, evidenceGroupMeta] of evidenceGroups) {
				if (evidenceGroupMeta.length > 0) return classificationId;
			}
			return null;
		});
	}

	get companiesSummarySignal(): string {
		const firstDev = this.store.developers.at(0);
		const firstPublisher = this.store.publishers.at(0);

		if (firstDev?.Id === firstPublisher?.Id) return firstDev?.Name ?? "";

		if (firstDev && firstPublisher) return [firstDev.Name, firstPublisher.Name].join(", ");

		if (firstDev) return firstDev.Name;

		return firstPublisher?.Name ?? "";
	}

	get evidenceGroupsSignal(): Map<ClassificationId, EvidenceGroupMeta[]> {
		return this.#evidenceGroupsSignal;
	}

	get highestClassificationStringSignal(): string {
		switch (this.#highestClassificationSignal) {
			case "HORROR":
				return m["score_engine.HORROR.engineLabel"]();
			case "RUN-BASED":
				return m["score_engine.RUN-BASED.engineLabel"]();
			default:
				return "";
		}
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
