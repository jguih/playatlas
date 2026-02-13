import type { CanonicalTaxonomySignalsMap, CanonicalTextSignalsMap } from "../../engine.signals";
import type { RunBasedEvidenceGroup } from "../run-based.score-engine.meta";

export const RUN_BASED_ENGINE_CANONICAL_TEXT_SIGNALS = {
	// #region: procedural_runs
	ROGUELIKE_LABEL: {
		group: "procedural_runs",
		tier: "A",
		weight: 60,
		isGate: true,
	},
	ROGUELITE_LABEL: {
		group: "procedural_runs",
		tier: "A",
		weight: 55,
		isGate: true,
	},
	PROCEDURAL_GENERATION_LABEL: {
		group: "procedural_runs",
		tier: "B",
		weight: 30,
		isGate: false,
	},
	RANDOMIZED_MAPS_LABEL: {
		group: "procedural_runs",
		tier: "B",
		weight: 30,
		isGate: false,
	},
	EVER_SHIFTING_LABEL: {
		group: "procedural_runs",
		tier: "C",
		weight: 15,
		isGate: false,
	},
	CONSTANTLY_CHANGING_ENVIRONMENT_LABEL: {
		group: "procedural_runs",
		tier: "C",
		weight: 20,
		isGate: false,
	},
	RUN_LOOP_LANGUAGE_LABEL: {
		group: "procedural_runs",
		tier: "C",
		weight: 20,
		isGate: false,
	},
	TRY_AGAIN_LOOP_LABEL: {
		group: "procedural_runs",
		tier: "C",
		weight: 20,
		isGate: false,
	},
	DUNGEON_CRAWL_LABEL: {
		group: "procedural_runs",
		tier: "C",
		weight: 20,
		isGate: false,
	},
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: {
		group: "permadeath_reset",
		tier: "B",
		weight: 35,
		isGate: false,
	},
	RESET_ON_DEATH_LABEL: {
		group: "permadeath_reset",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	NO_CHECKPOINTS_LABEL: {
		group: "permadeath_reset",
		tier: "C",
		weight: 10,
		isGate: false,
	},
	// #endregion
	// #region: run_variability
	GAMEPLAY_VARIETY_LABEL: {
		group: "run_variability",
		tier: "B",
		weight: 35,
		isGate: false,
	},
	RANDOMIZED_ITEMS_LABEL: {
		group: "run_variability",
		tier: "B",
		weight: 34,
		isGate: false,
	},
	BUILD_VARIETY_LABEL: {
		group: "run_variability",
		tier: "B",
		weight: 25,
		isGate: false,
	},
	ENDLESS_RUN_LABEL: {
		group: "run_variability",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	DAILY_CHALLENGES: {
		group: "run_variability",
		tier: "C",
		weight: 12,
		isGate: false,
	},
	CUSTOMIZE_YOUR_RUN_LABEL: {
		group: "run_variability",
		tier: "C",
		weight: 20,
		isGate: false,
	},
	ENDLESSLY_REPLAYABLE_LABEL: {
		group: "run_variability",
		tier: "C",
		weight: 12,
		isGate: false,
	},
	// #endregion
	// #region: meta_progression
	ROGUELITE_PROGRESSION_LABEL: {
		group: "meta_progression",
		tier: "B",
		weight: 30,
		isGate: false,
	},
	META_PROGRESSION_SYSTEM_LABEL: {
		group: "meta_progression",
		tier: "B",
		weight: 25,
		isGate: false,
	},
	PERMANENT_UPGRADES_LABEL: {
		group: "meta_progression",
		tier: "B",
		weight: 24,
		isGate: false,
	},
	PERMANENT_UNLOCKS_LABEL: {
		group: "meta_progression",
		tier: "B",
		weight: 22,
		isGate: false,
	},
	// #endregion
} as const satisfies CanonicalTextSignalsMap<string, RunBasedEvidenceGroup>;

export type RunBasedTextSignalId = keyof typeof RUN_BASED_ENGINE_CANONICAL_TEXT_SIGNALS;

export const RUN_BASED_ENGINE_CANONICAL_TAXONOMY_SIGNALS = {
	// #region: procedural_runs
	ROGUELIKE_TAXONOMY: {
		group: "procedural_runs",
		tier: "A",
		weight: 60,
		isGate: true,
	},
	ROGUELITE_TAXONOMY: {
		group: "procedural_runs",
		tier: "A",
		weight: 55,
		isGate: true,
	},
	PROCEDURAL_GENERATION_TAXONOMY: {
		group: "procedural_runs",
		tier: "B",
		weight: 30,
		isGate: false,
	},
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_TAXONOMY: {
		group: "permadeath_reset",
		tier: "B",
		weight: 35,
		isGate: true,
	},
	// #endregion
	// #region: run_variability
	REPLAY_VALUE_TAXONOMY: {
		group: "run_variability",
		tier: "B",
		weight: 30,
		isGate: false,
	},
	// #endregion
} as const satisfies CanonicalTaxonomySignalsMap<string, RunBasedEvidenceGroup>;

export type RunBasedTaxonomySignalId = keyof typeof RUN_BASED_ENGINE_CANONICAL_TAXONOMY_SIGNALS;
