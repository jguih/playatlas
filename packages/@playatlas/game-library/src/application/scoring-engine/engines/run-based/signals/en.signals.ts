import { SEP } from "../../../engine.regexp.utils";
import type { LanguageTaxonomySignalsMap, LanguageTextSignalsMap } from "../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_EN as PATTERN } from "../regex/en.pattern.dict";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

const POSSESSIVE = `(?:her|his|the|your)\\b`;
const RUN_LANGUAGE = `(?:run|loop|session|cycle|playthrough|journey|adventure)s?\\b`;
const REPETITION_LANGUAGE = `(?:each|every|per|new|another)\\b`;

const WORLD_LANGUAGE = `(?:map|world|level|dungeon|planet|environment|castle)s?\\b`;

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
	RANDOMLY_GENERATED_MAPS_LABEL: [],
	RANDOM_MAPS_LABEL: [
		new RegExp(`randomized` + SEP + WORLD_LANGUAGE, "i"),
		new RegExp(`randomly` + SEP + `generated` + SEP + WORLD_LANGUAGE, "i"),
		"randomly generated action RPG",
		"unpredictable layouts",
		"the layout differs each time",
		new RegExp(`dynamic` + SEP + WORLD_LANGUAGE + SEP + `generation`, "i"),
		new RegExp(`ever-changing` + SEP + WORLD_LANGUAGE, "i"),
	],
	EVER_SHIFTING_LABEL: ["ever-shifting", "ever shifting"],
	CONSTANTLY_CHANGING_ENVIRONMENT_LABEL: [
		new RegExp(`constantly` + SEP + `changing` + SEP + WORLD_LANGUAGE, "i"),
		new RegExp(`fresh` + SEP + `layout` + SEP + REPETITION_LANGUAGE + SEP + RUN_LANGUAGE, "i"),
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
		new RegExp(`death` + SEP + `resets` + SEP + POSSESSIVE + SEP + RUN_LANGUAGE, "i"),
		new RegExp(RUN_LANGUAGE + SEP + `resets` + SEP + `on` + SEP + `death`, "i"),
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
	BUILD_ITEM_VARIETY_LABEL: [],
	DAILY_CHALLENGES: ["daily challenges"],
	BUILD_VARIETY_LABEL: [
		"combine loot",
		"different builds",
		"unique builds",
		"build variety",
		"experiment with builds",
		"varied playstyles",
	],
	ENDLESS_RUN_LABEL: ["continue your run indefinitely", "limitlessly increase in power"],
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
