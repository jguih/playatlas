import type {
	EvidenceSource,
	EvidenceTier,
	ScoreEngineLanguage,
	StoredEvidenceStatus,
} from "@playatlas/common/domain";
import type { CanonicalSignalId } from "./language";

export type Evidence<TGroup> = {
	source: EvidenceSource;
	sourceHint?: string;
	match: string | number;
	patternExplanation: string;
	lang: ScoreEngineLanguage;
	signalId: CanonicalSignalId;
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
