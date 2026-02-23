import type { LanguageTaxonomySignalsMap, LanguageTextSignalsMap } from "../../../language";
import { HORROR_ENGINE_PATTERN_DICTIONARY_PT as PATTERN } from "../regex/pt.pattern.dictionary";
import type { HorrorTaxonomySignalId, HorrorTextSignalId } from "./canonical.signals";

export const HORROR_ENGINE_TEXT_SIGNALS_PT = {
	// #region: horror_identity
	HORROR_GAME_LABEL: ["jogo de terror", "horror-game"],
	HORROR_ADVENTURE_LABEL: ["aventura e terror", "terror e aventura", "aventura de terror"],
	GRUELING_HORROR_LABEL: ["terror implacável", "terror brutal", "terror medonho"],
	// #endregion
	// #region: combat_engagement
	TIMED_DODGES_LABEL: ["esquivas no tempo certo", "esquivas cronometradas"],
	FIRST_PERSON_SHOOTER_LABEL: [PATTERN.FIRST_PERSON_SHOOTER],
	THIRD_PERSON_SHOOTER_LABEL: [PATTERN.THIRD_PERSON_SHOOTER],
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_LABEL: [PATTERN.SURVIVAL_HORROR],
	SURVIVAL_NIGHTMARE_LABEL: ["pesadelo de sobrevivência"],
	RESOURCE_MANAGEMENT_LABEL: ["gerenciamento de recursos"],
	LIMITED_RESOURCES_LABEL: ["recursos limitados"],
	INVENTORY_MANAGEMENT_LABEL: ["gerenciamento de inventário", "gestão de inventário"],
	FIGHT_FOR_SURVIVAL_LABEL: ["lute pela sobrevivência"],
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_LABEL: [PATTERN.PSYCHOLOGICAL_HORROR],
	DESCEND_INTO_MADNESS_LABEL: ["descida à loucura", "mergulhar na loucura"],
	DISTURBING_LABEL: ["perturbador"],
	NIGHTMARE_LABEL: ["pesadelo"],
	NIGHTMARISH_LABEL: ["onírico e perturbador", "de pesadelo"],
	// #endregion
	// #region: atmospheric_horror
	ATMOSPHERIC_HORROR: ["terror atmosférico", "terror-atmosférico"],
	UNSETTLING_ATMOSPHERE_LABEL: [
		"aventura repleta de pavor",
		"aventura cheia de terror",
		"atmosfera tensa",
		"tensão constante",
		"jornada atmosférica",
		"jornada imersiva e atmosférica",
	],
	UNSETTLING_WORLD_LABEL: ["mundo aterrorizante"],
	ATMOSPHERIC_LANGUAGE_LABEL: [PATTERN.PERTURBADOR],
	// #endregion
} as const satisfies LanguageTextSignalsMap<HorrorTextSignalId>;

export const HORROR_ENGINE_TAXONOMY_SIGNALS_PT = {
	// #region: horror_identity
	HORROR_TAXONOMY: ["terror"],
	// #endregion
	// #region: combat_engagement
	FIRST_PERSON_SHOOTER_TAXONOMY: [PATTERN.FIRST_PERSON_SHOOTER],
	THIRD_PERSON_SHOOTER_TAXONOMY: [PATTERN.THIRD_PERSON_SHOOTER],
	ACTION_TAXONOMY: ["ação"],
	COMBAT_TAXONOMY: ["combate"],
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_TAXONOMY: [PATTERN.SURVIVAL_HORROR, ["terror", "sobrevivência"]],
	SURVIVAL_TAXONOMY: ["sobrevivência"],
	// #endregion
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_TAXONOMY: ["terror psicológico", ["terror", "psicológico"]],
	SUPERNATURAL_TAXONOMY: ["sobrenatural"],
	// #endregion
	// #region: atmospheric_horror
	ATMOSPHERIC_HORROR_TAXONOMY: [
		"terror atmosférico",
		"terror-atmosférico",
		["terror", "atmosférico"],
	],
	ATMOSPHERIC_TAXONOMY: ["atmosférico"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<HorrorTaxonomySignalId>;
