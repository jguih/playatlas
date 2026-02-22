import type { EvidenceSource } from "@playatlas/common/domain";

type SourcePriorityPolicy = Record<EvidenceSource, number>;

export type ScoreEngineSourcePriorityPolicy<TGroup extends string> = Record<
	TGroup,
	SourcePriorityPolicy
>;

export const SCORE_ENGINE_DEFAULT_SOURCE_PRIORITY = {
	text: 3,
	genre: 2,
	tag: 1,
} as const satisfies SourcePriorityPolicy;
