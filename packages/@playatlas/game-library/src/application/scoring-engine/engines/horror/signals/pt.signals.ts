import type { LanguageTaxonomySignalsMap, LanguageTextSignalsMap } from "../../../language";
import type { HorrorTaxonomySignalId, HorrorTextSignalId } from "./canonical.signals";

export const HORROR_ENGINE_TEXT_SIGNALS_PT = {
	// #region: horror_identity
	HORROR_GAME_LABEL: ["jogo de terror", "horror-game"],
	HORROR_ADVENTURE_LABEL: ["aventura e terror", "terror e aventura", "aventura de terror"],
	GRUELING_HORROR_LABEL: ["terror implacável", "terror brutal", "terror medonho"],
	// #endregion
	// #region: combat_engagement
	TIMED_DODGES_LABEL: ["esquivas no tempo certo", "esquivas cronometradas"],
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_LABEL: ["terror de sobrevivência"],
	SURVIVAL_NIGHTMARE_LABEL: ["pesadelo de sobrevivência"],
	RESOURCE_MANAGEMENT_LABEL: ["gerenciamento de recursos"],
	LIMITED_RESOURCES_LABEL: ["recursos limitados"],
	INVENTORY_MANAGEMENT_LABEL: ["gerenciamento de inventário", "gestão de inventário"],
	FIGHT_FOR_SURVIVAL_LABEL: ["lute pela sobrevivência"],
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_LABEL: ["terror psicológico"],
	DESCEND_INTO_MADNESS_LABEL: ["descida à loucura", "mergulhar na loucura"],
	DISTURBING_LABEL: ["perturbador"],
	NIGHTMARE_LABEL: ["pesadelo"],
	NIGHTMARISH_LABEL: ["onírico e perturbador", "de pesadelo"],
	// #endregion
	// #region: atmospheric_horror
	CREEPING_DREAD_LABEL: ["pavor crescente", "medo crescente"],
	TENSION_ATMOSPHERE_LABEL: ["atmosfera tensa", "tensão constante"],
	TERRIFYING_WORLD_LABEL: ["mundo aterrorizante"],
	DREAD_FILLED_ADVENTURE_LABEL: ["aventura repleta de pavor", "aventura cheia de terror"],
	ATMOSPHERIC_JOURNEY_LABEL: ["jornada atmosférica", "jornada imersiva e atmosférica"],
	DREAD_LABEL: ["pavor"],
	EERIE_LABEL: ["sinistro", "assustador"],
	SINISTER_LABEL: ["sinistro"],
	HAUNTING_LABEL: ["assombrado", "assustador"],
	TERRIFYING_LABEL: ["aterrorizante", "apavorante"],
	UNSETTLING_LABEL: ["perturbador", "inquietante"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<HorrorTextSignalId>;

export const HORROR_ENGINE_TAXONOMY_SIGNALS_PT = {
	// #region: horror_identity
	HORROR_TAXONOMY: ["terror"],
	// #endregion
	// #region: combat_engagement
	FIRST_PERSON_SHOOTER_TAXONOMY: ["tiro em primeira pessoa"],
	THIRD_PERSON_SHOOTER_TAXONOMY: ["tiro em terceira pessoa"],
	ACTION_TAXONOMY: ["ação"],
	COMBAT_TAXONOMY: ["combate"],
	// #endregion
	// #region: resource_survival
	SURVIVAL_HORROR_TAXONOMY: ["terror de sobrevivência", ["terror", "sobrevivência"]],
	SURVIVAL_TAXONOMY: ["sobrevivência"],
	// #endregion
	// #region: psychological_horror
	PSYCHOLOGICAL_HORROR_TAXONOMY: ["terror psicológico", ["terror", "psicológico"]],
	SUPERNATURAL_TAXONOMY: ["sobrenatural"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<HorrorTaxonomySignalId>;
