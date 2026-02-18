import { FILLER, SEP, VERB } from "../../engine.regexp.utils";
import type {
	LanguageTaxonomySignalsMap,
	LanguageTextSignalsMap,
} from "../../score-engine.language.types";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

const POSSESSIVE = `(?:her|his|the|your)\\b`;
const RUN_LANGUAGE = `(?:run|loop|session|cycle|playthrough|journey|adventure)s?\\b`;
const LOOP = `(?:every\\s+time|whenever|each\\s+time|when)\\b`;
const SUBJECT_PRONOUN = `(?:she|he|you)\\b`;
const DEATH = `die[s]?\\b`;
const REPETITION_LANGUAGE = `(?:each|every|per|new|another)\\b`;

const WORLD_LANGUAGE = `(?:map|world|level|dungeon|planet|environment|castle)s?\\b`;

export const RUN_BASED_ENGINE_TEXT_SIGNALS_EN = {
	// #region: run_based_identity
	ROGUELIKE_LABEL: ["roguelike", "rogue-like"],
	ROGUELITE_LABEL: ["roguelite", "rogue-lite"],
	RUN_LOOP_STRUCTURE_LABEL: [
		new RegExp(
			VERB("restart") +
				SEP +
				POSSESSIVE +
				SEP +
				RUN_LANGUAGE +
				SEP +
				FILLER(1) +
				LOOP +
				SEP +
				SUBJECT_PRONOUN +
				SEP +
				DEATH,
			"i",
		),
	],
	RUN_LOOP_LANGUAGE_LABEL: [
		new RegExp(REPETITION_LANGUAGE + SEP + RUN_LANGUAGE, "i"),
		new RegExp(`between` + SEP + RUN_LANGUAGE, "i"),
		new RegExp(RUN_LANGUAGE + SEP + `after` + SEP + RUN_LANGUAGE, "i"),
	],
	TRY_AGAIN_LOOP_LABEL: [
		"try again",
		"attempt after attempt",
		"learn from failure",
		"fail and retry",
		"die and try again",
	],
	// #region: procedural_runs
	PROCEDURAL_GENERATION_LABEL: [
		new RegExp(
			`procedurally` + SEP + `(?:generated|created)` + SEP + FILLER(1) + WORLD_LANGUAGE,
			"i",
		),
		"procedural generation",
		new RegExp(`procedural` + SEP + FILLER(1) + WORLD_LANGUAGE, "i"),
	],
	RANDOMLY_GENERATED_MAPS_LABEL: [],
	RANDOM_MAPS_LABEL: [
		new RegExp(`randomized` + SEP + +WORLD_LANGUAGE, "i"),
		new RegExp(`randomly` + SEP + `generated` + SEP + WORLD_LANGUAGE, "i"),
		"randomly generated action RPG",
		"unpredictable layouts",
		"the layout differs each time",
		new RegExp(`dynamic` + SEP + WORLD_LANGUAGE + SEP + `generation`, "i"),
		new RegExp(`ever-changing` + SEP + WORLD_LANGUAGE, "i"),
	],
	RANDOM_ENCOUNTERS_LABEL: [
		new RegExp(
			`(?:(?:varied|generated|dynamic|changing|random)|procedurally\\s+generated)\\b` +
				SEP +
				FILLER(1) +
				`(?:encounter|enemy\\s+layout)s?\\b`,
			"i",
		),
		new RegExp(`fresh\\s+challenges` + SEP + REPETITION_LANGUAGE + SEP + RUN_LANGUAGE, "i"),
	],
	EVER_SHIFTING_LABEL: ["ever-shifting", "ever shifting"],
	CONSTANTLY_CHANGING_ENVIRONMENT_LABEL: [
		new RegExp(`constantly` + SEP + `changing` + SEP + WORLD_LANGUAGE, "i"),
		new RegExp(`fresh` + SEP + `layout` + SEP + REPETITION_LANGUAGE + SEP + RUN_LANGUAGE, "i"),
		"unique layouts each time",
	],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: ["permadeath", "permanent death"],
	RESET_ON_DEATH_LABEL: [
		new RegExp(
			VERB("restart") +
				SEP +
				POSSESSIVE +
				SEP +
				RUN_LANGUAGE +
				SEP +
				FILLER(1) +
				LOOP +
				SEP +
				SUBJECT_PRONOUN +
				SEP +
				DEATH,
			"i",
		),
		new RegExp(`death` + SEP + `resets` + SEP + POSSESSIVE + SEP + RUN_LANGUAGE, "i"),
		new RegExp(RUN_LANGUAGE + SEP + `resets` + SEP + `on` + SEP + `death`, "i"),
		"start over after death",
		"begin again after failure",
		"unforgiving death system",
	],
	NO_CHECKPOINTS_LABEL: ["no checkpoints"],
	// #endregion
	// #region: run_variability
	CUSTOMIZE_YOUR_RUN_LABEL: ["customize your run"],
	DAILY_CHALLENGES: ["daily challenges"],
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
	BUILD_VARIETY_LABEL: [
		"combine loot",
		"different builds",
		"unique builds",
		"build variety",
		"experiment with builds",
		"varied playstyles",
	],
	GAMEPLAY_VARIETY_LABEL: [
		"gameplay modifiers",
		"no run will ever be the same",
		"no two runs are the same",
		"never experience the same game twice",
		"randomized stages, enemies, and items",
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
