import type { LanguageTaxonomySignalsMap, LanguageTextSignalsMap } from "../../../language";
import type { HorrorTaxonomySignalId, HorrorTextSignalId } from "./canonical.signals";

export const HORROR_ENGINE_TEXT_SIGNALS_EN = {
	// #region: horror_identity
	HORROR_GAME_LABEL: ["horror game", "horror-game"],
	HORROR_ADVENTURE_LABEL: ["horror adventure", "horror-adventure"],
	GRUELING_HORROR_LABEL: ["grueling horror"],
	// #endregion
	// #region: combat_engagement
	TIMED_DODGES_LABEL: ["timed dodges"],
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_LABEL: ["survival horror", "survival-horror"],
	SURVIVAL_NIGHTMARE_LABEL: ["survival nightmare", "survival-nightmare"],
	RESOURCE_MANAGEMENT_LABEL: ["resource management"],
	LIMITED_RESOURCES_LABEL: ["limited resources"],
	INVENTORY_MANAGEMENT_LABEL: ["inventory management", "inventory and ammo management"],
	FIGHT_FOR_SURVIVAL_LABEL: ["fight for survival"],
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_LABEL: ["psychological horror", "psychological-horror"],
	DESCEND_INTO_MADNESS_LABEL: ["descend into madness", "succumb to the madness"],
	DISTURBING_LABEL: ["disturbing"],
	NIGHTMARE_LABEL: ["nightmare"],
	NIGHTMARISH_LABEL: ["nightmarish"],
	// #endregion
	// #region: atmospheric_horror
	CREEPING_DREAD_LABEL: ["creeping dread"],
	TENSION_ATMOSPHERE_LABEL: ["tension and thick atmosphere", "tension atmosphere"],
	TERRIFYING_WORLD_LABEL: ["terrifying world"],
	DREAD_FILLED_ADVENTURE_LABEL: ["dread-filled adventure", "dread filled adventure"],
	ATMOSPHERIC_JOURNEY_LABEL: ["atmospheric journey"],
	DREAD_LABEL: ["dread"],
	EERIE_LABEL: ["eerie"],
	SINISTER_LABEL: ["sinister"],
	HAUNTING_LABEL: ["haunting"],
	TERRIFYING_LABEL: ["terrifying"],
	UNSETTLING_LABEL: ["unsettling"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<HorrorTextSignalId>;

export const HORROR_ENGINE_TAXONOMY_SIGNALS_EN = {
	// #region: horror_identity
	HORROR_TAXONOMY: ["horror"],
	// #endregion
	// #region: combat_engagement
	FIRST_PERSON_SHOOTER_TAXONOMY: ["first-person shooter", "first person shooter"],
	THIRD_PERSON_SHOOTER_TAXONOMY: ["third-person shooter", "third person shooter"],
	ACTION_TAXONOMY: ["action"],
	COMBAT_TAXONOMY: ["combat"],
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_TAXONOMY: ["survival horror", "survival-horror", ["survival", "horror"]],
	SURVIVAL_TAXONOMY: ["survival"],
	// #endregion
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_TAXONOMY: [
		"psychological horror",
		"psychological-horror",
		["psychological", "horror"],
	],
	SUPERNATURAL_TAXONOMY: ["supernatural"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<HorrorTaxonomySignalId>;
