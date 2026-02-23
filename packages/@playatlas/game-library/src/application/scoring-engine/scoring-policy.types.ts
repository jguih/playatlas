import type { EvidenceGroupTier } from "@playatlas/common/domain";
import type { Evidence, StoredEvidence } from "./evidence.types";
import type { ScoreEnginePenalty } from "./policy/penalty.types";
import type { Synergy } from "./synergy.types";

export type ComputeScoreBreakdownProps<TGroup> = {
	groups: Array<{
		group: TGroup;
		evidences: StoredEvidence<TGroup>[];
		contribution: number;
		normalizedContribution: number;
		tier: EvidenceGroupTier;
	}>;
	synergies: Array<Synergy>;
	penalties: Array<ScoreEnginePenalty>;
};

export type EvidenceSignalIdRegistry<TGroup> = {
	append: (evidence: Evidence<TGroup>) => void;
	wasUsed: (evidence: Evidence<TGroup>) => boolean;
};
