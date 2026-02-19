import type { CanonicalTaxonomySignalsMap, CanonicalTextSignalsMap } from "../../../language";
import type { HorrorEvidenceGroup } from "../horror.score-engine.meta";

export const HORROR_ENGINE_CANONICAL_TEXT_SIGNALS = {
	// #region: horror_identity
	HORROR_GAME_LABEL: {
		group: "horror_identity",
		tier: "A",
		weight: 30,
		isGate: true,
	},
	HORROR_ADVENTURE_LABEL: {
		group: "horror_identity",
		tier: "A",
		weight: 30,
		isGate: true,
	},
	GRUELING_HORROR_LABEL: {
		group: "horror_identity",
		tier: "B",
		weight: 20,
		isGate: true,
	},
	// #endregion
	// #region: combat_engagement
	TIMED_DODGES_LABEL: {
		group: "combat_engagement",
		tier: "C",
		weight: 6,
		isGate: false,
	},
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_LABEL: {
		group: "resource_survival",
		tier: "A",
		weight: 20,
		isGate: true,
	},
	SURVIVAL_NIGHTMARE_LABEL: {
		group: "resource_survival",
		tier: "B",
		weight: 16,
		isGate: false,
	},
	RESOURCE_MANAGEMENT_LABEL: {
		group: "resource_survival",
		tier: "B",
		weight: 14,
		isGate: false,
	},
	LIMITED_RESOURCES_LABEL: {
		group: "resource_survival",
		tier: "B",
		weight: 16,
		isGate: false,
	},
	INVENTORY_MANAGEMENT_LABEL: {
		group: "resource_survival",
		tier: "C",
		weight: 8,
		isGate: false,
	},
	FIGHT_FOR_SURVIVAL_LABEL: {
		group: "resource_survival",
		tier: "C",
		weight: 8,
		isGate: false,
	},
	// #endregion
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_LABEL: {
		group: "psychological_horror",
		tier: "A",
		weight: 35,
		isGate: true,
	},
	DESCEND_INTO_MADNESS_LABEL: {
		group: "psychological_horror",
		tier: "B",
		weight: 25,
		isGate: false,
	},
	DISTURBING_LABEL: {
		group: "psychological_horror",
		tier: "C",
		weight: 14,
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
	// #region: atmospheric_horror
	CREEPING_DREAD_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 25,
		isGate: false,
	},
	TENSION_ATMOSPHERE_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	TERRIFYING_WORLD_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	DREAD_FILLED_ADVENTURE_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	ATMOSPHERIC_JOURNEY_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 18,
		isGate: false,
	},
	DREAD_LABEL: {
		group: "atmospheric_horror",
		tier: "C",
		weight: 14,
		isGate: false,
	},
	EERIE_LABEL: {
		group: "atmospheric_horror",
		tier: "C",
		weight: 14,
		isGate: false,
	},
	SINISTER_LABEL: {
		group: "atmospheric_horror",
		tier: "C",
		weight: 12,
		isGate: false,
	},
	HAUNTING_LABEL: {
		group: "atmospheric_horror",
		tier: "C",
		weight: 12,
		isGate: false,
	},
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
	// #endregion
} as const satisfies CanonicalTextSignalsMap<string, HorrorEvidenceGroup>;

export type HorrorTextSignalId = keyof typeof HORROR_ENGINE_CANONICAL_TEXT_SIGNALS;

export const HORROR_ENGINE_CANONICAL_TAXONOMY_SIGNALS = {
	// #region: horror_identity
	HORROR_TAXONOMY: {
		group: "horror_identity",
		tier: "A",
		weight: 30,
		isGate: true,
	},
	// #endregion
	// #region: combat_engagement
	THIRD_PERSON_SHOOTER_TAXONOMY: {
		group: "combat_engagement",
		tier: "B",
		weight: 15,
		isGate: false,
	},
	FIRST_PERSON_SHOOTER_TAXONOMY: {
		group: "combat_engagement",
		tier: "B",
		weight: 15,
		isGate: false,
	},
	ACTION_TAXONOMY: {
		group: "combat_engagement",
		tier: "C",
		weight: 8,
		isGate: false,
	},
	COMBAT_TAXONOMY: {
		group: "combat_engagement",
		tier: "C",
		weight: 8,
		isGate: false,
	},
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_TAXONOMY: {
		group: "resource_survival",
		tier: "A",
		weight: 30,
		isGate: true,
	},
	SURVIVAL_TAXONOMY: {
		group: "resource_survival",
		tier: "B",
		weight: 8,
		isGate: false,
	},
	// #endregion
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_TAXONOMY: {
		group: "psychological_horror",
		tier: "A",
		weight: 35,
		isGate: true,
	},
	SUPERNATURAL_TAXONOMY: {
		group: "psychological_horror",
		tier: "B",
		weight: 8,
		isGate: false,
	},
	// #endregion
} as const satisfies CanonicalTaxonomySignalsMap<string, HorrorEvidenceGroup>;

export type HorrorTaxonomySignalId = keyof typeof HORROR_ENGINE_CANONICAL_TAXONOMY_SIGNALS;
