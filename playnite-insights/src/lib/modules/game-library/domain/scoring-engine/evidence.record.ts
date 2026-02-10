import type { EvidenceSource, EvidenceTier, StoredEvidenceStatus } from "@playatlas/common/domain";

export type Evidence = {
	source: EvidenceSource;
	sourceHint?: string;
	match: string | number;
	weight: number;
	group: string;
	tier: EvidenceTier;
	isGate: boolean;
	status: StoredEvidenceStatus;
	contribution: number;
};
