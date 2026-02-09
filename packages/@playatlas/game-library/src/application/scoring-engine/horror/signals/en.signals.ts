import type {
	LanguageTaxonomySignalsMap,
	LanguageTextSignalsMap,
} from "../../score-engine.language.types";
import type { HorrorTaxonomySignalId, HorrorTextSignalId } from "./canonical.signals";

export const HORROR_ENGINE_TEXT_SIGNALS_EN = {
	// #region: Tier A
	PSYCHOLOGICAL_HORROR_LABEL: ["psychological horror", "psychological horror game"],
	SURVIVAL_HORROR_LABEL: ["survival horror", "survival-horror", "survival horror game"],
	COSMIC_HORROR_LABEL: ["cosmic horror", "cosmic-horror", "cosmic horror game"],
	HORROR_GAME_LABEL: ["horror game", "horror-game"],
	HORROR_ADVENTURE_LABEL: [
		"horror adventure",
		"horror-adventure",
		"horror adventure game",
		"adventure horror",
		"adventure-horror",
		"adventure horror game",
	],
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
	// #endregion
	// #region: Tier C
	TERRIFYING_LABEL: ["terrifying"],
	UNSETTLING_LABEL: ["unsettling"],
	NIGHTMARE_LABEL: ["nightmare"],
	NIGHTMARISH_LABEL: ["nightmarish"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<HorrorTextSignalId>;

export const HORROR_ENGINE_TAXONOMY_SIGNALS_EN = {
	HORROR_GENRE: ["horror"],
} as const satisfies LanguageTaxonomySignalsMap<HorrorTaxonomySignalId>;
