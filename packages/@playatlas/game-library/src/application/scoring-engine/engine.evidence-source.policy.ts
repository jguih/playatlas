import type { EvidenceSource } from "@playatlas/common/domain";

type SourcePolicy = {
	cap: number;
	multiplier?: number;
};

export type ScoreEngineSourcePolicy<TGroup extends string> = Record<
	TGroup,
	Record<EvidenceSource, SourcePolicy>
>;
