import { type LanguageTaxonomySignalsMap, type LanguageTextSignalsMap } from "../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT as PATTERN } from "../regex/pt.pattern.dictionary";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

export const RUN_BASED_ENGINE_TEXT_SIGNALS_PT = {
	// #region: run_based_identity
	ROGUELIKE_ROGUELITE_LABEL: [PATTERN.ROGUELIKE_LITE],
	// #endregion
	// #region: procedural_runs
	PROCEDURALLY_GENERATED_WORLD_LABEL: [PATTERN.PROCEDURALLY_GENERATED_WORLD],
	PROCEDURAL_GENERATION_LABEL: ["procedural", "geração procedural"],
	RANDOMLY_GENERATED_MAPS_LABEL: [PATTERN.RANDOMLY_CREATED_WORLDS],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: ["permadeath", "morte permanente"],
	// #endregion
	// #region: run_variability
	BUILD_VARIETY_LABEL: [PATTERN.UNIQUE_BUILDS, "infinitas combinações de configurações"],
	SYNERGY_LABEL: ["sinergias", "combinações"],
	RUN_LOOP_LANGUAGE_LABEL: [PATTERN.RUN_AFTER_RUN, PATTERN.RUN_REPETITION],
	REPLAY_VALUE_LABEL: ["alta rejogabilidade", "alto valor de rejogabilidade"],
	EVER_CHANGING_LABEL: [PATTERN.EVER_CHANGING],
	// #endregion
	// #region: meta_progression
	ROGUELITE_PROGRESSION_LABEL: [
		"progressão roguelite",
		"progressão estilo roguelite",
		"experiência roguelite",
	],
	META_PROGRESSION_SYSTEM_LABEL: ["sistema de meta progressão", "sistema de progressão permanente"],
	PERMANENT_UPGRADES_LABEL: ["melhorias permanentes", "upgrades permanentes"],
	PERMANENT_UNLOCKS_LABEL: ["desbloqueios permanentes", "desbloqueios persistentes"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<RunBasedTextSignalId>;

export const RUN_BASED_ENGINE_TAXONOMY_SIGNALS_PT = {
	// #region: run_based_identity
	ROGUELIKE_ROGUELITE_TAXONOMY: [PATTERN.ROGUELIKE_LITE],
	// #endregion
	// #region: procedural_runs
	PROCEDURAL_GENERATION_TAXONOMY: ["geração procedural", "geração-procedural"],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_TAXONOMY: ["permadeath", "morte permanente"],
	// #endregion
	// #region: run_variability
	REPLAY_VALUE_TAXONOMY: ["rejogabilidade", "alto valor de rejogabilidade", "alta rejogabilidade"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<RunBasedTaxonomySignalId>;
