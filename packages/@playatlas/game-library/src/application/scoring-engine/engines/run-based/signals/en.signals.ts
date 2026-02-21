import { type LanguageTaxonomySignalsMap, type LanguageTextSignalsMap } from "../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN as PATTERN } from "../regex/en.pattern.dictionary";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

export const RUN_BASED_ENGINE_TEXT_SIGNALS_EN = {
	// #region: run_based_identity
	ROGUELIKE_LABEL: ["roguelike", "rogue-like"],
	ROGUELITE_LABEL: ["roguelite", "rogue-lite"],
	RUN_LOOP_STRUCTURE_LABEL: [PATTERN.RESTART_AFTER_DEATH],
	RUN_LOOP_LANGUAGE_LABEL: [PATTERN.RUN_REPETITION, PATTERN.RUN_AFTER_RUN, PATTERN.BETWEEN_RUNS],
	TRY_AGAIN_LOOP_LABEL: [
		PATTERN.TRY_AGAIN,
		"attempt after attempt",
		"learn from failure",
		"fail and retry",
		PATTERN.DIE_AND_TRY_AGAIN,
	],
	// #region: procedural_runs
	PROCEDURAL_GENERATION_LABEL: [PATTERN.PROCEDURALLY_GENERATED_WORLD_STRONG],
	RANDOMLY_GENERATED_MAPS_LABEL: [
		PATTERN.RANDOMLY_CREATED_WORLDS,
		PATTERN.DYNAMIC_WORLD_GENERATION,
		"randomly generated action RPG",
		"the layout differs each time",
	],
	RANDOM_MAPS_LABEL: [PATTERN.RANDOM_WORLDS],
	EVER_SHIFTING_LABEL: ["ever-shifting", "ever shifting", PATTERN.EVER_CHANGING],
	CONSTANTLY_CHANGING_ENVIRONMENT_LABEL: [
		PATTERN.EVER_CHANGING_ENVIRONMENT,
		// new RegExp(`fresh` + SEP + `layout` + SEP + REPETITION_LANGUAGE + SEP + RUN_LANGUAGE, "i"),
		"unique layouts each time",
	],
	PROCEDURAL_WORLD_INDICATION_LABEL: [
		"procedural generation",
		PATTERN.PROCEDURAL_WORLD,
		PATTERN.PROCEDURALLY_GENERATED_WORLD_WEAK,
	],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: ["permadeath", "permanent death"],
	RESET_ON_DEATH_LABEL: [
		PATTERN.RESTART_AFTER_DEATH,
		// new RegExp(`death` + SEP + `resets` + SEP + POSSESSIVE + SEP + RUN_LANGUAGE, "i"),
		// new RegExp(RUN_LANGUAGE + SEP + `resets` + SEP + `on` + SEP + `death`, "i"),
		"start over after death",
		"begin again after failure",
		"unforgiving death system",
	],
	NO_CHECKPOINTS_LABEL: ["no checkpoints"],
	// #endregion
	// #region: run_variability
	GAMEPLAY_VARIETY_LABEL: [
		"gameplay modifiers",
		"no run will ever be the same",
		"no two runs are the same",
		"never experience the same game twice",
		"randomized stages, enemies, and items",
	],
	BUILD_VARIETY_LABEL: [
		"combine loot",
		"different builds",
		"unique builds",
		"build variety",
		"experiment with builds",
		"varied playstyles",
	],
	UNIQUE_BUILDS_LABEL: [],
	ITEMS_VOLUME_LABEL: [],
	RANDOMIZED_ITEMS_LABEL: [
		"randomized items",
		"random items",
		"random loot",
		"random upgrades",
		"random power-ups",
		"random power ups",
		"procedural loot",
		"item variety",
	],
	ENCOUNTER_VOLUME_LABEL: [],
	RANDOMIZED_ENCOUNTERS_LABEL: [],
	CUSTOMIZE_YOUR_RUN_LABEL: ["customize your run"],
	DAILY_CHALLENGES: ["daily challenges"],
	ENDLESS_RUN_LABEL: ["continue your run indefinitely", "limitlessly increase in power"],
	BUILD_ITEM_VARIETY_LABEL: [],
	ENDLESSLY_REPLAYABLE_LABEL: ["endlessly replayable"],
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
	ROGUELIKE_TAXONOMY: ["roguelike", "rogue-like"],
	ROGUELITE_TAXONOMY: ["roguelite", "rogue-lite"],
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
