import type {
	LanguageTaxonomySignalsMap,
	LanguageTextSignalsMap,
} from "../../score-engine.language.types";
import type { HorrorTaxonomySignalId, HorrorTextSignalId } from "./canonical.signals";

export const HORROR_ENGINE_TEXT_SIGNALS_EN = {
	// #region: Tier A
	PSYCHOLOGICAL_HORROR_LABEL: ["psychological horror", "psychological-horror"],
	SURVIVAL_HORROR_LABEL: ["survival horror", "survival-horror"],
	COSMIC_HORROR_LABEL: ["cosmic horror", "cosmic-horror"],
	HORROR_GAME_LABEL: ["horror game", "horror-game"],
	HORROR_ADVENTURE_LABEL: [
		"horror adventure",
		"horror-adventure",
		"adventure horror",
		"adventure-horror",
	],
	HORROR_EXPERIENCE_LABEL: ["horror experience"],
	HORROR_TITLE_LABEL: ["horror title"],
	GRUELING_HORROR_LABEL: ["grueling horror"],
	// #endregion
	// #region: Tier B
	CREEPING_DREAD_LABEL: ["creeping dread"],
	DREAD_LABEL: ["dread"],
	EERIE_LABEL: ["eerie"],
	SINISTER_LABEL: ["sinister"],
	HAUNTING_LABEL: ["haunting"],
	DISTURBING_LABEL: ["disturbing"],
	GROTESQUE_LABEL: ["grotesque"],
	MACABRE_LABEL: ["macabre"],
	HORROR_THEMED_LABEL: ["horror themed", "horror-themed"],
	SURVIVAL_NIGHTMARE_LABEL: ["survival nightmare", "survival-nightmare"],
	RESOURCE_MANAGEMENT_LABEL: ["resource management"],
	INVENTORY_MANAGEMENT_LABEL: ["inventory management", "inventory and ammo management"],
	LIMITED_RESOURCES_LABEL: ["limited resources"],
	DESCEND_INTO_MADNESS_LABEL: ["descend into madness", "succumb to the madness"],
	// #endregion
	// #region: Tier C
	TERRIFYING_LABEL: ["terrifying"],
	UNSETTLING_LABEL: ["unsettling"],
	NIGHTMARE_LABEL: ["nightmare"],
	NIGHTMARISH_LABEL: ["nightmarish"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<HorrorTextSignalId>;

export const HORROR_ENGINE_TAXONOMY_SIGNALS_EN = {
	// #region: Tier A
	HORROR_TAXONOMY: ["horror"],
	SURVIVAL_HORROR_TAXONOMY: ["survival horror", "survival-horror", ["survival", "horror"]],
	PSYCHOLOGICAL_HORROR_TAXONOMY: [
		"psychological horror",
		"psychological-horror",
		["psychological", "horror"],
	],
	// #endregion
	// #region: Tier B
	SURVIVAL_TAXONOMY: ["survival"],
	SUPERNATURAL_TAXONOMY: ["supernatural"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<HorrorTaxonomySignalId>;
