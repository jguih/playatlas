import { m } from "$lib/paraglide/messages";
import type { ClassificationId } from "@playatlas/common/domain";
import type {
	HorrorEvidenceGroup,
	RunBasedEvidenceGroup,
} from "@playatlas/game-library/application";

export type EvidenceGroupMeta = {
	label: () => string;
	description: () => string;
};

type ScoreEngineMetaRaw = {
	label: () => string;
	groups: Record<string, EvidenceGroupMeta>;
};

const horrorEvidenceGroupRegistry = {
	horror_identity: {
		label: () => m["score_engine.HORROR.groups.horror_identity.label"](),
		description: () => m["score_engine.HORROR.groups.horror_identity.description"](),
	},
	atmospheric_horror: {
		label: () => m["score_engine.HORROR.groups.atmospheric_horror.label"](),
		description: () => m["score_engine.HORROR.groups.atmospheric_horror.description"](),
	},
	combat_engagement: {
		label: () => m["score_engine.HORROR.groups.combat_engagement.label"](),
		description: () => m["score_engine.HORROR.groups.combat_engagement.description"](),
	},
	psychological_horror: {
		label: () => m["score_engine.HORROR.groups.psychological_horror.label"](),
		description: () => m["score_engine.HORROR.groups.psychological_horror.description"](),
	},
	resource_survival: {
		label: () => m["score_engine.HORROR.groups.resource_survival.label"](),
		description: () => m["score_engine.HORROR.groups.resource_survival.description"](),
	},
} as const satisfies Record<HorrorEvidenceGroup, EvidenceGroupMeta>;

const runBasedEvidenceGroupRegistry = {
	run_based_identity: {
		label: () => m["score_engine.RUN-BASED.groups.procedural_runs.label"](),
		description: () => m["score_engine.RUN-BASED.groups.procedural_runs.description"](),
	},
	procedural_runs: {
		label: () => m["score_engine.RUN-BASED.groups.procedural_runs.label"](),
		description: () => m["score_engine.RUN-BASED.groups.procedural_runs.description"](),
	},
	permadeath_reset: {
		label: () => m["score_engine.RUN-BASED.groups.procedural_runs.label"](),
		description: () => m["score_engine.RUN-BASED.groups.procedural_runs.description"](),
	},
	run_variability: {
		label: () => m["score_engine.RUN-BASED.groups.procedural_runs.label"](),
		description: () => m["score_engine.RUN-BASED.groups.procedural_runs.description"](),
	},
	meta_progression: {
		label: () => m["score_engine.RUN-BASED.groups.procedural_runs.label"](),
		description: () => m["score_engine.RUN-BASED.groups.procedural_runs.description"](),
	},
} as const satisfies Record<RunBasedEvidenceGroup, EvidenceGroupMeta>;

export const scoreEngineRegistry = {
	HORROR: {
		label: () => m["score_engine.HORROR.engineLabel"](),
		groups: horrorEvidenceGroupRegistry,
	},
	"RUN-BASED": {
		label: () => m["score_engine.RUN-BASED.engineLabel"](),
		groups: runBasedEvidenceGroupRegistry,
	},
	SURVIVAL: { label: () => m["score_engine.SURVIVAL.engineLabel"](), groups: {} },
} as const satisfies Record<ClassificationId, ScoreEngineMetaRaw>;

export type ScoreEngineMeta = typeof scoreEngineRegistry;

export const getScoreEngineLabel = (classificationId: ClassificationId): string =>
	scoreEngineRegistry[classificationId].label();

export const getScoreEngineGroupDetails = (classificationId: ClassificationId) =>
	scoreEngineRegistry[classificationId].groups;
