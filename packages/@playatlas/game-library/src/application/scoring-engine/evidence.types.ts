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
	index?: number;
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
};

export type StoredEvidence<TGroup> = Evidence<TGroup> & {
	status: StoredEvidenceStatus;
	contribution: number;
};
