import type { GameClassification } from "$lib/modules/game-library/domain";
import { m } from "$lib/paraglide/messages";
import { type ClassificationId } from "@playatlas/common/domain";
import { SvelteMap } from "svelte/reactivity";
import {
	EvidenceGroupDetailsRegistry,
	type EvidenceGroupDetails,
} from "./evidence-group-details-registry";
import type { GameAggregateStore } from "./game-aggregate-store.svelte";

type GameViewModelDeps = {
	gameAggregateStore: GameAggregateStore;
};

export class GameViewModel {
	/**
	 * To consider classifications which total score was equal or higher than this threshold.
	 */
	private STRONGEST_CLASSIFICATION_SCORE_THRESHOLD = 0.3 as const;

	private store: GameAggregateStore;
	private gameClassificationsOrderedByStrongest: SvelteMap<ClassificationId, GameClassification>;
	strongestClassificationsLabelSignal: string[];
	evidenceGroupLocalizedDetailsByClassificationSignal: SvelteMap<
		ClassificationId,
		EvidenceGroupDetails[]
	>;

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
			const labels: string[] = [];

			for (const [classificationId, gameClassification] of this
				.gameClassificationsOrderedByStrongest) {
				if (gameClassification.NormalizedScore <= this.STRONGEST_CLASSIFICATION_SCORE_THRESHOLD)
					continue;

				switch (classificationId) {
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

		this.evidenceGroupLocalizedDetailsByClassificationSignal = $derived.by(() => {
			const gameClassifications = this.gameClassificationsOrderedByStrongest;
			const evidenceGroupLocalizedDetailsByClassification = new SvelteMap<
				ClassificationId,
				EvidenceGroupDetails[]
			>();

			for (const [classificationId, gameClassification] of gameClassifications) {
				const groupsMeta = gameClassification.EvidenceGroupMeta;

				if (!groupsMeta) continue;
				if (gameClassification.Breakdown.type !== "normalized") continue;

				const evidenceGroupLocalizedDetails: EvidenceGroupDetails[] = [];
				evidenceGroupLocalizedDetailsByClassification.set(
					classificationId,
					evidenceGroupLocalizedDetails,
				);

				for (const group of gameClassification.Breakdown.breakdown.groups) {
					const groupName = group.group;
					if (!groupsMeta[groupName].userFacing) continue;

					const details = EvidenceGroupDetailsRegistry.getDetailsForGroup(
						classificationId,
						groupName,
					);
					if (details) evidenceGroupLocalizedDetails.push(details);
				}
			}

			return evidenceGroupLocalizedDetailsByClassification;
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
