import type { CanonicalTaxonomySignalsMap, CanonicalTextSignalsMap } from "../../engine.signals";
import type { HorrorEvidenceGroup } from "../horror.score-engine.meta";

export const HORROR_ENGINE_CANONICAL_TEXT_SIGNALS = {
	// #region: Tier A
	PSYCHOLOGICAL_HORROR_LABEL: {
		group: "psychological_horror",
		tier: "A",
		weight: 60,
		isGate: true,
	},
	SURVIVAL_HORROR_LABEL: {
		group: "survival_horror",
		tier: "A",
		weight: 45,
		isGate: true,
	},
	COSMIC_HORROR_LABEL: {
		group: "cosmic_horror",
		tier: "A",
		weight: 45,
		isGate: true,
	},
	HORROR_GAME_LABEL: {
		group: "core_horror",
		tier: "A",
		weight: 35,
		isGate: true,
	},
	HORROR_ADVENTURE_LABEL: {
		group: "core_horror",
		tier: "A",
		weight: 35,
		isGate: true,
	},
	// #endregion
	// #region: Tier B
	CREEPING_DREAD_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 25,
		isGate: true,
	},
	DREAD_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 25,
		isGate: false,
	},
	EERIE_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	SINISTER_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	HAUNTING_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	DISTURBING_LABEL: {
		group: "psychological_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	GROTESQUE_LABEL: {
		group: "cosmic_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	MACABRE_LABEL: {
		group: "cosmic_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	// #endregion
	// #region: Tier C
	TERRIFYING_LABEL: {
		group: "atmospheric_horror",
		tier: "C",
		weight: 15,
		isGate: false,
	},
	UNSETTLING_LABEL: {
		group: "atmospheric_horror",
		tier: "C",
		weight: 12,
		isGate: false,
	},
	NIGHTMARE_LABEL: {
		group: "psychological_horror",
		tier: "C",
		weight: 12,
		isGate: false,
	},
	NIGHTMARISH_LABEL: {
		group: "psychological_horror",
		tier: "C",
		weight: 12,
		isGate: false,
	},
	// #endregion
} as const satisfies CanonicalTextSignalsMap<string, HorrorEvidenceGroup>;

export type HorrorTextSignalId = keyof typeof HORROR_ENGINE_CANONICAL_TEXT_SIGNALS;

export const HORROR_ENGINE_CANONICAL_TAXONOMY_SIGNALS = {
	HORROR_GENRE: {
		group: "core_horror",
		tier: "A",
		weight: 55,
		isGate: true,
	},
} as const satisfies CanonicalTaxonomySignalsMap<string, HorrorEvidenceGroup>;

export type HorrorTaxonomySignalId = keyof typeof HORROR_ENGINE_CANONICAL_TAXONOMY_SIGNALS;
