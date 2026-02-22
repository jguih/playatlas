import type { CanonicalTaxonomySignalsMap, CanonicalTextSignalsMap } from "../../../language";
import type { RunBasedEvidenceGroup } from "../run-based.score-engine.meta";

export const RUN_BASED_ENGINE_CANONICAL_TEXT_SIGNALS = {
	// #region: run_based_identity
	ROGUELIKE_ROGUELITE_LABEL: {
		group: "run_based_identity",
		tier: "A",
		weight: 35,
		isGate: true,
	},
	// #endregion
	// #region: procedural_runs
	PROCEDURALLY_GENERATED_WORLD_LABEL: {
		group: "procedural_runs",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	PROCEDURAL_GENERATION_LABEL: {
		group: "procedural_runs",
		tier: "B",
		weight: 15,
		isGate: false,
	},
	RANDOMLY_GENERATED_MAPS_LABEL: {
		group: "procedural_runs",
		tier: "B",
		weight: 12,
		isGate: false,
	},
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: {
		group: "permadeath_reset",
		tier: "B",
		weight: 15,
		isGate: false,
	},
	// #endregion
	// #region: run_variability
	BUILD_VARIETY_LABEL: {
		group: "run_variability",
		tier: "B",
		weight: 12,
		isGate: false,
	},
	SYNERGY_LABEL: {
		group: "run_variability",
		tier: "B",
		weight: 10,
		isGate: false,
	},
	RUN_LOOP_LANGUAGE_LABEL: {
		group: "run_variability",
		tier: "B",
		weight: 15,
		isGate: false,
	},
	REPLAY_VALUE_LABEL: {
		group: "run_variability",
		tier: "C",
		weight: 8,
		isGate: false,
	},
	EVER_CHANGING_LABEL: {
		group: "run_variability",
		tier: "C",
		weight: 8,
		isGate: false,
	},
	// #endregion
	// #region: meta_progression
	ROGUELITE_PROGRESSION_LABEL: {
		group: "meta_progression",
		tier: "A",
		weight: 25,
		isGate: false,
	},
	META_PROGRESSION_SYSTEM_LABEL: {
		group: "meta_progression",
		tier: "B",
		weight: 15,
		isGate: false,
	},
	PERMANENT_UPGRADES_LABEL: {
		group: "meta_progression",
		tier: "C",
		weight: 10,
		isGate: false,
	},
	PERMANENT_UNLOCKS_LABEL: {
		group: "meta_progression",
		tier: "C",
		weight: 10,
		isGate: false,
	},
	// #endregion
} as const satisfies CanonicalTextSignalsMap<string, RunBasedEvidenceGroup>;

export type RunBasedTextSignalId = keyof typeof RUN_BASED_ENGINE_CANONICAL_TEXT_SIGNALS;

export const RUN_BASED_ENGINE_CANONICAL_TAXONOMY_SIGNALS = {
	// #region: run_based_identity
	ROGUELIKE_ROGUELITE_TAXONOMY: {
		group: "run_based_identity",
		tier: "A",
		weight: 35,
		isGate: true,
	},
	// #endregion
	// #region: procedural_runs
	PROCEDURAL_GENERATION_TAXONOMY: {
		group: "procedural_runs",
		tier: "B",
		weight: 25,
		isGate: false,
	},
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_TAXONOMY: {
		group: "permadeath_reset",
		tier: "B",
		weight: 20,
		isGate: false,
	},
	// #endregion
	// #region: run_variability
	REPLAY_VALUE_TAXONOMY: {
		group: "run_variability",
		tier: "C",
		weight: 12,
		isGate: false,
	},
	// #endregion
} as const satisfies CanonicalTaxonomySignalsMap<string, RunBasedEvidenceGroup>;

export type RunBasedTaxonomySignalId = keyof typeof RUN_BASED_ENGINE_CANONICAL_TAXONOMY_SIGNALS;
