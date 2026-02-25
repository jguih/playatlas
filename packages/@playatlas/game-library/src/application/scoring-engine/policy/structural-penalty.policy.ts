import type { EvidenceSource } from "@playatlas/common/domain";
import type { ScoreEnginePenalty } from "./penalty.types";
import type { ScoreEnginePolicy } from "./policy.types";

export type ScoreEngineStructuralPenaltyPolicy<TGroup> = ScoreEnginePolicy<
	TGroup,
	ScoreEnginePenalty | undefined
>;

export const penalizeTagOnly = <TGroup>(): ScoreEngineStructuralPenaltyPolicy<TGroup> => {
	return {
		apply: ({ groups, subtotal }) => {
			const uniqueSources = new Set<EvidenceSource>();

			for (const group of groups) {
				for (const evidence of group.evidences) {
					if (evidence.status === "ignored") continue;
					uniqueSources.add(evidence.source);
				}
			}

			if (uniqueSources.size === 1 && uniqueSources.has("tag")) {
				const contribution = subtotal * 0.4 * -1;

				return {
					type: "tags_only",
					contribution,
					details: `40% of subtotal penalty for tag only source`,
				};
			}
		},
	};
};
