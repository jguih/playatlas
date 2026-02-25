import type { LanguageTaxonomySignalsMap, LanguageTextSignalsMap } from "../../../language";
import { HORROR_ENGINE_PATTERN_DICTIONARY_EN as PATTERN } from "../regex/en.pattern.dictionary";
import type { HorrorTaxonomySignalId, HorrorTextSignalId } from "./canonical.signals";

export const HORROR_ENGINE_TEXT_SIGNALS_EN = {
	// #region: horror_identity
	HORROR_GAME_LABEL: ["horror game", "horror-game"],
	HORROR_ADVENTURE_LABEL: ["horror adventure", "horror-adventure"],
	GRUELING_HORROR_LABEL: ["grueling horror"],
	// #endregion
	// #region: combat_engagement
	TIMED_DODGES_LABEL: ["timed dodges"],
	FIRST_PERSON_SHOOTER_LABEL: [PATTERN.FIRST_PERSON_SHOOTER],
	THIRD_PERSON_SHOOTER_LABEL: [PATTERN.THIRD_PERSON_SHOOTER],
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_LABEL: ["survival horror", "survival-horror"],
	SURVIVAL_NIGHTMARE_LABEL: ["survival nightmare", "survival-nightmare"],
	RESOURCE_MANAGEMENT_LABEL: ["resource management"],
	LIMITED_RESOURCES_LABEL: ["limited resources"],
	INVENTORY_MANAGEMENT_LABEL: ["inventory management", "inventory and ammo management"],
	FIGHT_FOR_SURVIVAL_LABEL: ["fight for survival"],
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_LABEL: [PATTERN.PSYCHOLOGICAL_HORROR],
	DESCEND_INTO_MADNESS_LABEL: ["descend into madness", "succumb to the madness"],
	DISTURBING_LABEL: ["disturbing"],
	NIGHTMARE_LABEL: ["nightmare"],
	NIGHTMARISH_LABEL: ["nightmarish"],
	// #endregion
	// #region: atmospheric_horror
	ATMOSPHERIC_HORROR: ["atmospheric horror", "atmospheric-horror"],
	HORROR_ATMOSPHERE_LABEL: [
		PATTERN.HORROR_ATMOSPHERE,
		"atmospheric journey",
		"tension and thick atmosphere",
		"tension atmosphere",
	],
	HORROR_WORLD_LABEL: [PATTERN.HORROR_WORLD],
	ATMOSPHERIC_LANGUAGE_LABEL: [PATTERN.HORROR_ADJECTIVES],
	// #endregion
} as const satisfies LanguageTextSignalsMap<HorrorTextSignalId>;

export const HORROR_ENGINE_TAXONOMY_SIGNALS_EN = {
	// #region: horror_identity
	HORROR_TAXONOMY: ["horror"],
	GOTHIC_TAXONOMY: ["gothic"],
	DEMONS_ZOMBIES_TAXONOMY: [PATTERN.DEMONS_ZOMBIES],
	DARK_TAXONOMY: ["dark"],
	// #endregion
	// #region: combat_engagement
	FIRST_PERSON_SHOOTER_TAXONOMY: [PATTERN.FIRST_PERSON_SHOOTER],
	THIRD_PERSON_SHOOTER_TAXONOMY: [PATTERN.THIRD_PERSON_SHOOTER],
	ACTION_TAXONOMY: ["action"],
	COMBAT_TAXONOMY: ["combat"],
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_TAXONOMY: ["survival horror", "survival-horror", ["survival", "horror"]],
	SURVIVAL_TAXONOMY: ["survival"],
	// #endregion
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_TAXONOMY: [PATTERN.PSYCHOLOGICAL_HORROR, ["psychological", "horror"]],
	SUPERNATURAL_TAXONOMY: ["supernatural"],
	// #endregion
	// #region: atmospheric_horror
	ATMOSPHERIC_HORROR_TAXONOMY: [
		"atmospheric horror",
		"atmospheric-horror",
		["atmospheric", "horror"],
	],
	ATMOSPHERIC_TAXONOMY: ["atmospheric"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<HorrorTaxonomySignalId>;
