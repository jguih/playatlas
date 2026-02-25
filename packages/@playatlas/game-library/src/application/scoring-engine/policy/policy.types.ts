import type { EvidenceGroupTier } from "@playatlas/common/domain";
import type { StoredEvidence } from "../evidence.types";

export type ScoreEnginePolicyProps<TGroup> = {
	readonly groups: ReadonlyArray<{
		group: TGroup;
		evidences: StoredEvidence<TGroup>[];
		contribution: number;
		normalizedContribution: number;
		tier: EvidenceGroupTier;
	}>;
	readonly normalizedContributionByGroup: ReadonlyMap<TGroup, number>;
	readonly groupTierByGroup: ReadonlyMap<TGroup, EvidenceGroupTier>;
	readonly subtotal: number;
};

export type ScoreEnginePolicy<TGroup, TResult> = {
	apply: (props: ScoreEnginePolicyProps<TGroup>) => TResult;
};
