import type { EvidenceSource, EvidenceTier, StoredEvidenceStatus } from "@playatlas/common/domain";

export type Evidence<TGroup> = {
	source: EvidenceSource;
	sourceHint?: string;
	match: string | number;
	patternExplanation: string;
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	// Whether the signal is identity defining or not
	isGate: boolean;
};

export type StoredEvidence<TGroup> = Evidence<TGroup> & {
	status: StoredEvidenceStatus;
	contribution: number;
};
