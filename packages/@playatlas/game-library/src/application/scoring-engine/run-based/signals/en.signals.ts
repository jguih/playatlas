import type {
	LanguageTaxonomySignalsMap,
	LanguageTextSignalsMap,
} from "../../score-engine.language.types";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

export const RUN_BASED_ENGINE_TEXT_SIGNALS_EN = {
	// #region: procedural_runs
	ROGUELIKE_LABEL: ["roguelike", "rogue-like"],
	ROGUELITE_LABEL: ["roguelite", "rogue-lite"],
	PROCEDURAL_GENERATION_LABEL: [
		"procedurally generated levels",
		"procedural generation",
		"procedurally generated dungeons",
		"generated dungeons",
	],
	RANDOMIZED_MAPS_LABEL: [
		"randomized levels",
		"randomized maps",
		"randomly generated maps",
		"randomly generated levels",
		"randomly generated action RPG",
		"unpredictable layouts",
		"the layout differs each time",
		"dynamic level generation",
		"no two runs are the same",
		"ever-changing levels",
		"ever changing levels",
		"ever-changing castle",
		"ever changing castle",
		"never experience the same game twice",
	],
	EVER_SHIFTING_LABEL: ["ever-shifting", "ever shifting"],
	CONSTANTLY_CHANGING_ENVIRONMENT_LABEL: [
		"constantly changing environments",
		"constantly changing environment",
		"fresh layout every playthrough",
		"unique layouts each time",
	],
	BRANCHING_PATHS_LABEL: ["branching paths"],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: ["permadeath", "permanent death"],
	RESET_ON_DEATH_LABEL: [
		"death resets your run",
		"start over after death",
		"run resets on death",
		"begin again after failure",
		"restart from the beginning",
		"unforgiving death system",
	],
	NO_CHECKPOINTS_LABEL: ["no checkpoints"],
	// #endregion
	// #region: run_variability
	ENDLESSLY_REPLAYABLE_LABEL: ["endlessly replayable"],
	CUSTOMIZE_YOUR_RUN_LABEL: ["customize your run"],
	DAILY_CHALLENGES: ["daily challenges"],
	// #endregion
	// #region: meta_progression
	ROGUELITE_PROGRESSION_LABEL: ["roguelite progression", "rogue-lite progression"],
	META_PROGRESSION_SYSTEM_LABEL: ["meta progression system"],
	PERMANENT_UPGRADES_LABEL: ["permanent upgrades", "persistent upgrades"],
	PERMANENT_UNLOCKS_LABEL: ["permanent unlocks", "persistent unlocks"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<RunBasedTextSignalId>;

export const RUN_BASED_ENGINE_TAXONOMY_SIGNALS_EN = {
	// #region: procedural_runs
	ROGUELIKE_TAXONOMY: ["roguelike", "rogue-like"],
	ROGUELITE_TAXONOMY: ["roguelite", "rogue-lite"],
	PROCEDURAL_GENERATION_TAXONOMY: ["procedural generation", "procedural-generation"],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_TAXONOMY: ["permadeath", "perma death", "perma-death"],
	// #endregion
	// #region: run_variability
	REPLAY_VALUE_TAXONOMY: ["replay value", "replay-value"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<RunBasedTaxonomySignalId>;
