import type { CanonicalTaxonomySignalsMap, CanonicalTextSignalsMap } from "../../../language";
import type { HorrorEvidenceGroup } from "../horror.score-engine.meta";

export const HORROR_ENGINE_CANONICAL_TEXT_SIGNALS = {
	// #region: horror_identity
	HORROR_GAME_LABEL: {
		group: "horror_identity",
		tier: "A",
		weight: 30,
	},
	HORROR_ADVENTURE_LABEL: {
		group: "horror_identity",
		tier: "A",
		weight: 30,
	},
	GRUELING_HORROR_LABEL: {
		group: "horror_identity",
		tier: "B",
		weight: 20,
	},
	// #endregion
	// #region: combat_engagement
	TIMED_DODGES_LABEL: {
		group: "combat_engagement",
		tier: "C",
		weight: 6,
	},
	FIRST_PERSON_SHOOTER_LABEL: {
		group: "combat_engagement",
		tier: "B",
		weight: 16,
	},
	THIRD_PERSON_SHOOTER_LABEL: {
		group: "combat_engagement",
		tier: "B",
		weight: 14,
	},
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_LABEL: {
		group: "resource_survival",
		tier: "A",
		weight: 20,
	},
	SURVIVAL_NIGHTMARE_LABEL: {
		group: "resource_survival",
		tier: "B",
		weight: 16,
	},
	RESOURCE_MANAGEMENT_LABEL: {
		group: "resource_survival",
		tier: "B",
		weight: 14,
	},
	LIMITED_RESOURCES_LABEL: {
		group: "resource_survival",
		tier: "B",
		weight: 16,
	},
	INVENTORY_MANAGEMENT_LABEL: {
		group: "resource_survival",
		tier: "C",
		weight: 8,
	},
	FIGHT_FOR_SURVIVAL_LABEL: {
		group: "resource_survival",
		tier: "C",
		weight: 8,
	},
	// #endregion
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_LABEL: {
		group: "psychological_horror",
		tier: "A",
		weight: 35,
	},
	DESCEND_INTO_MADNESS_LABEL: {
		group: "psychological_horror",
		tier: "B",
		weight: 25,
	},
	DISTURBING_LABEL: {
		group: "psychological_horror",
		tier: "C",
		weight: 14,
	},
	NIGHTMARE_LABEL: {
		group: "psychological_horror",
		tier: "C",
		weight: 12,
	},
	NIGHTMARISH_LABEL: {
		group: "psychological_horror",
		tier: "C",
		weight: 12,
	},
	// #endregion
	// #region: atmospheric_horror
	ATMOSPHERIC_HORROR: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 25,
	},
	HORROR_WORLD_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 20,
	},
	HORROR_ATMOSPHERE_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 22,
	},
	ATMOSPHERIC_LANGUAGE_LABEL: {
		group: "atmospheric_horror",
		tier: "B",
		weight: 8,
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
	},
	GOTHIC_TAXONOMY: {
		group: "horror_identity",
		tier: "C",
		weight: 6,
	},
	DEMONS_ZOMBIES_TAXONOMY: {
		group: "horror_identity",
		tier: "C",
		weight: 6,
	},
	DARK_TAXONOMY: {
		group: "horror_identity",
		tier: "C",
		weight: 6,
	},
	// #endregion
	// #region: combat_engagement
	THIRD_PERSON_SHOOTER_TAXONOMY: {
		group: "combat_engagement",
		tier: "B",
		weight: 15,
	},
	FIRST_PERSON_SHOOTER_TAXONOMY: {
		group: "combat_engagement",
		tier: "B",
		weight: 15,
	},
	ACTION_TAXONOMY: {
		group: "combat_engagement",
		tier: "C",
		weight: 8,
	},
	COMBAT_TAXONOMY: {
		group: "combat_engagement",
		tier: "C",
		weight: 8,
	},
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_TAXONOMY: {
		group: "resource_survival",
		tier: "A",
		weight: 30,
	},
	SURVIVAL_TAXONOMY: {
		group: "resource_survival",
		tier: "C",
		weight: 8,
	},
	// #endregion
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_TAXONOMY: {
		group: "psychological_horror",
		tier: "A",
		weight: 35,
	},
	SUPERNATURAL_TAXONOMY: {
		group: "psychological_horror",
		tier: "C",
		weight: 8,
	},
	// #endregion
	// #region: atmospheric_horror
	ATMOSPHERIC_HORROR_TAXONOMY: {
		group: "atmospheric_horror",
		tier: "A",
		weight: 35,
	},
	ATMOSPHERIC_TAXONOMY: {
		group: "atmospheric_horror",
		tier: "C",
		weight: 8,
	},
	// #endregion
} as const satisfies CanonicalTaxonomySignalsMap<string, HorrorEvidenceGroup>;

export type HorrorTaxonomySignalId = keyof typeof HORROR_ENGINE_CANONICAL_TAXONOMY_SIGNALS;
