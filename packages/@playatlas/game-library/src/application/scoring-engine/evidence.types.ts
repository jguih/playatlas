import type { EvidenceSource, EvidenceTier, StoredEvidenceStatus } from "@playatlas/common/domain";

export type EvidenceGroup = string;

export type Evidence<TGroup extends EvidenceGroup> = {
	source: EvidenceSource;
	sourceHint?: string;
	match: string | number;
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	// Whether the signal is identity defining or not
	isGate: boolean;
};

export type StoredEvidence<TGroup extends EvidenceGroup> = Evidence<TGroup> & {
	status: StoredEvidenceStatus;
	contribution: number;
};
