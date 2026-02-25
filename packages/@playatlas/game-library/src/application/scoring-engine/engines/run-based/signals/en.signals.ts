import { type LanguageTaxonomySignalsMap, type LanguageTextSignalsMap } from "../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN as PATTERN } from "../regex/en.pattern.dictionary";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

export const RUN_BASED_ENGINE_TEXT_SIGNALS_EN = {
	// #region: run_based_identity
	ROGUELIKE_ROGUELITE_LABEL: [PATTERN.ROGUELIKE_LITE],
	// #region: procedural_runs
	PROCEDURALLY_GENERATED_WORLD_LABEL: [PATTERN.PROCEDURALLY_GENERATED_WORLD_STRONG],
	PROCEDURAL_GENERATION_LABEL: ["procedural", PATTERN.PROCEDURALLY_GENERATED_WORLD_WEAK],
	RANDOMLY_GENERATED_MAPS_LABEL: [
		"randomly generated",
		PATTERN.RANDOMLY_CREATED_WORLDS,
		PATTERN.RANDOM_WORLDS,
	],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: ["permadeath", "permanent death"],
	// #endregion
	// #region: run_variability
	BUILD_VARIETY_LABEL: ["builds", PATTERN.UNIQUE_BUILDS],
	SYNERGY_LABEL: ["synergies", "combinations"],
	RUN_LOOP_LANGUAGE_LABEL: [PATTERN.RUN_AFTER_RUN, PATTERN.RUN_REPETITION, PATTERN.BETWEEN_RUNS],
	REPLAY_VALUE_LABEL: ["replay value"],
	EVER_CHANGING_LABEL: [PATTERN.EVER_CHANGING],
	// #endregion
	// #region: meta_progression
	ROGUELITE_PROGRESSION_LABEL: ["roguelite progression", "rogue-lite progression"],
	META_PROGRESSION_SYSTEM_LABEL: ["meta progression system"],
	PERMANENT_UPGRADES_LABEL: ["permanent upgrades", "persistent upgrades"],
	PERMANENT_UNLOCKS_LABEL: ["permanent unlocks", "persistent unlocks"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<RunBasedTextSignalId>;

export const RUN_BASED_ENGINE_TAXONOMY_SIGNALS_EN = {
	// #region: run_based_identity
	ROGUELIKE_ROGUELITE_TAXONOMY: [PATTERN.ROGUELIKE_LITE],
	// #endregion
	// #region: procedural_runs
	PROCEDURAL_GENERATION_TAXONOMY: ["procedural generation", "procedural-generation"],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_TAXONOMY: ["permadeath", "perma death", "perma-death"],
	// #endregion
	// #region: run_variability
	REPLAY_VALUE_TAXONOMY: ["replay value", "replay-value"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<RunBasedTaxonomySignalId>;
