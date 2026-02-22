import type { EvidenceSource } from "@playatlas/common/domain";

type SourcePolicy = {
	cap: number;
	multiplier: number;
};

export type ScoreEngineSourcePolicy = Record<EvidenceSource, SourcePolicy>;

export const SCORE_ENGINE_DEFAULT_EVIDENCE_SOURCE_POLICY = {
	text: { cap: Infinity, multiplier: 1.0 },
	genre: { cap: Infinity, multiplier: 0.9 },
	tag: { cap: 25, multiplier: 0.65 },
} as const satisfies ScoreEngineSourcePolicy;
