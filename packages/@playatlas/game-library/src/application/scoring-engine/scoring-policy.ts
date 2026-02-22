import type {
	CanonicalClassificationTier,
	EvidenceGroupTier,
	EvidenceSource,
} from "@playatlas/common/domain";
import type { ScoreEngineSourcePolicy } from "./engine.evidence-source.policy";
import type { ScoreEngineEvidenceGroupPolicy } from "./engine.policy";
import type { Evidence, StoredEvidence } from "./evidence.types";
import type { ScoreEngineStructuralPenaltyPolicy } from "./policy";
import type { ScoreEngineClassificationTierThresholdPolicy } from "./policy/classification-tier-threshold.policy";
import type { ScoreEngineGatePolicy } from "./policy/gate.policy";
import type { ScoreEngineGroupTierThresholdPolicy } from "./policy/group-tier-threshold.policy";
import type { ScoreBreakdown } from "./score-breakdown";
import type { ScoreEngineEvidenceGroupsMeta } from "./score-engine.types";
import type { IScoringPolicyPort } from "./scoring-policy.port";
import type { ComputeScoreBreakdownProps } from "./scoring-policy.types";

type SynergyContext = {
	groupCount: number;
	distinctSources: Set<EvidenceSource>;
};

export type ScoringPolicyDeps<TGroup extends string> = {
	readonly evidenceGroupMeta: ScoreEngineEvidenceGroupsMeta<TGroup>;
	readonly evidenceGroupPolicies: ScoreEngineEvidenceGroupPolicy<TGroup>;
	readonly evidenceSourcePolicy: ScoreEngineSourcePolicy;
	readonly classificationTierThresholdPolicy: ScoreEngineClassificationTierThresholdPolicy;
	readonly groupTierThresholdPolicy: ScoreEngineGroupTierThresholdPolicy;
	readonly gatePolicy: ScoreEngineGatePolicy<TGroup>;
	readonly structuralPenaltyPolicies: ReadonlyArray<ScoreEngineStructuralPenaltyPolicy<TGroup>>;
	readonly scoreCap: number;
};

export const makeScoringPolicy = <TGroup extends string>({
	evidenceGroupPolicies,
	evidenceSourcePolicy,
	classificationTierThresholdPolicy,
	groupTierThresholdPolicy,
	gatePolicy,
	scoreCap,
	structuralPenaltyPolicies,
}: ScoringPolicyDeps<TGroup>): IScoringPolicyPort<TGroup> => {
	const SOURCE_PRIORITY: Record<EvidenceSource, number> = {
		text: 3,
		genre: 2,
		tag: 1,
	};

	const joinByGroup = (evidence: Evidence<TGroup>[]): Map<TGroup, Evidence<TGroup>[]> => {
		const evidenceMap = new Map<TGroup, Evidence<TGroup>[]>();

		for (const e of evidence) {
			const current = evidenceMap.get(e.group);
			if (!current) evidenceMap.set(e.group, []);
			evidenceMap.get(e.group)!.push(e);
		}

		return evidenceMap;
	};

	const computeClassificationTier = (normalizedScore: number): CanonicalClassificationTier => {
		if (normalizedScore === 0) return "none";
		if (normalizedScore >= classificationTierThresholdPolicy.core) return "core";
		if (normalizedScore >= classificationTierThresholdPolicy.strong) return "strong";
		if (normalizedScore >= classificationTierThresholdPolicy.adjacent) return "adjacent";
		return "weak";
	};

	const computeGroupTier = (normalizedContribution: number): EvidenceGroupTier => {
		if (normalizedContribution === 0) return "none";
		if (normalizedContribution >= groupTierThresholdPolicy.strong) return "strong";
		if (normalizedContribution >= groupTierThresholdPolicy.moderate) return "moderate";
		return "light";
	};

	const computeBreakdown = (props: ComputeScoreBreakdownProps<TGroup>): ScoreBreakdown<TGroup> => {
		const { groups, synergies, penalties } = props;

		const groupSubtotal = groups.reduce((sum, g) => sum + g.contribution, 0);

		const expandedGroups: ScoreBreakdown<TGroup>["groups"] = groups.map((group) => {
			const contributionPercent = groupSubtotal === 0 ? 0 : group.contribution / groupSubtotal;

			return {
				...group,
				contributionPercent,
			};
		});

		const normalizedContributionByGroup = new Map(
			groups.map((g) => [g.group, g.normalizedContribution]),
		);
		const groupTierByGroup = new Map(groups.map((g) => [g.group, g.tier]));

		// TODO: Apply synergy policies here

		const synergiesSubtotal = synergies.reduce((sum, s) => sum + s.contribution, 0);

		const semanticSubtotal = groupSubtotal + synergiesSubtotal;

		for (const policy of structuralPenaltyPolicies) {
			const penalty = policy.apply({
				groups,
				normalizedContributionByGroup,
				groupTierByGroup,
				subtotal: semanticSubtotal,
			});
			if (penalty) penalties.push(penalty);
		}

		const penaltyTotal = penalties.reduce((sum, p) => sum + p.contribution, 0);

		const semanticTotalAfterPenalty = semanticSubtotal + penaltyTotal;

		const cappedSemanticTotal = Math.min(semanticTotalAfterPenalty, scoreCap);

		const { mode, confidenceMultiplier } = gatePolicy.apply({
			groups,
			normalizedContributionByGroup,
			groupTierByGroup,
			subtotal: cappedSemanticTotal,
		});

		const normalizedTotal = (cappedSemanticTotal / scoreCap) * confidenceMultiplier;
		const tier = computeClassificationTier(normalizedTotal);

		const breakdown: ScoreBreakdown<TGroup> = {
			mode,
			groups: expandedGroups,
			synergies,
			subtotal: semanticSubtotal,
			penalties,
			total: cappedSemanticTotal,
			normalizedTotal,
			tier,
		};
		return breakdown;
	};

	const computeSynergyContext = (evidence: Evidence<TGroup>[]): SynergyContext => {
		const groups = new Set<TGroup>();
		const sources = new Set<EvidenceSource>();

		for (const e of evidence) {
			if (e.group === "synergy") continue;

			groups.add(e.group);
			sources.add(e.source);
		}

		return {
			groupCount: groups.size,
			distinctSources: sources,
		};
	};

	const scoreSynergyWithGate = (ctx: SynergyContext): ScoreBreakdown<TGroup>["synergies"] => {
		if (ctx.groupCount < 2) return [];

		const sourceCount = ctx.distinctSources.size;
		const details = `${ctx.groupCount} group(s), ${sourceCount} source(s)`;

		let total = 0;

		if (sourceCount === 2) {
			total = 5;
		} else if (sourceCount >= 3) {
			total = 10;
		} else {
			return [];
		}

		return [
			{
				type: "multiple_sources",
				contribution: Math.floor(total),
				details,
			},
		];
	};

	const estimateEvidenceContribution = (evidence: Evidence<TGroup>): number => {
		let evidenceContribution = evidence.weight;
		const sourcePolicy = evidenceSourcePolicy[evidence.source];
		if (sourcePolicy.multiplier) evidenceContribution *= sourcePolicy.multiplier;
		return evidenceContribution;
	};

	const score = (evidence: Evidence<TGroup>[]): ScoreBreakdown<TGroup> => {
		const evidencesByGroup = joinByGroup(evidence);
		const usedEvidencesByGroup = new Map<TGroup, StoredEvidence<TGroup>[]>();
		const ignoredEvidencesByGroup = new Map<TGroup, StoredEvidence<TGroup>[]>();
		const contributionByGroup = new Map<TGroup, number>();
		const normalizedContributionByGroup = new Map<TGroup, number>();
		const groupsBreakdown: ComputeScoreBreakdownProps<TGroup>["groups"] = [];
		const penalties: ComputeScoreBreakdownProps<TGroup>["penalties"] = [];

		const use = (group: TGroup, evidence: Evidence<TGroup>, contribution: number) => {
			let used = usedEvidencesByGroup.get(group);
			if (!used) {
				used = [];
				usedEvidencesByGroup.set(group, used);
			}
			used.push({ ...evidence, status: "used", contribution });
		};

		const ignore = (group: TGroup, evidence: Evidence<TGroup>) => {
			let ignored = ignoredEvidencesByGroup.get(group);
			if (!ignored) {
				ignored = [];
				ignoredEvidencesByGroup.set(group, ignored);
			}
			ignored.push({ ...evidence, status: "ignored", contribution: 0 });
		};

		// Process Tier A evidences by group
		for (const [group, evidences] of evidencesByGroup) {
			let bestEvidence: Evidence<TGroup> | undefined;
			let bestEvidenceContribution: number = 0;

			for (const evidence of evidences) {
				if (evidence.tier !== "A") continue;

				const evidenceContribution = estimateEvidenceContribution(evidence);

				const current = bestEvidence;
				const currentContribution = bestEvidenceContribution;

				if (!current || evidenceContribution > currentContribution) {
					bestEvidence = evidence;
					bestEvidenceContribution = evidenceContribution;
					if (current) ignore(group, current);
				} else if (
					currentContribution === evidenceContribution &&
					SOURCE_PRIORITY[evidence.source] > SOURCE_PRIORITY[current.source]
				) {
					bestEvidence = evidence;
					bestEvidenceContribution = evidenceContribution;
					if (current) ignore(group, current);
				} else {
					ignore(group, evidence);
				}
			}

			if (!bestEvidence) continue;

			use(group, bestEvidence, bestEvidenceContribution);

			const sourcePolicy = evidenceSourcePolicy[bestEvidence.source];

			if (sourcePolicy.multiplier) bestEvidenceContribution *= sourcePolicy.multiplier;
			if (sourcePolicy.cap)
				bestEvidenceContribution = Math.min(bestEvidenceContribution, sourcePolicy.cap);

			contributionByGroup.set(group, bestEvidenceContribution);
		}

		// Process Tier B evidences by group
		for (const [group, evidences] of evidencesByGroup) {
			let contribution = contributionByGroup.get(group);

			if (!contribution) {
				contribution = 0;
				contributionByGroup.set(group, contribution);
			}

			for (const evidence of evidences) {
				if (evidence.tier !== "B") continue;

				const sourcePolicy = evidenceSourcePolicy[evidence.source];
				let evidenceContribution = evidence.weight;

				if (sourcePolicy.multiplier) evidenceContribution *= sourcePolicy.multiplier;
				if (sourcePolicy.cap)
					evidenceContribution = Math.min(evidenceContribution, sourcePolicy.cap);

				contribution += evidenceContribution;

				use(group, evidence, evidenceContribution);
			}

			contributionByGroup.set(group, contribution);
		}

		// Process Tier C evidences by group
		for (const [group, evidences] of evidencesByGroup) {
			let contribution = contributionByGroup.get(group);

			if (!contribution) {
				contribution = 0;
				contributionByGroup.set(group, contribution);
			}

			for (const evidence of evidences) {
				if (evidence.tier !== "C") continue;

				const sourcePolicy = evidenceSourcePolicy[evidence.source];
				let evidenceContribution = evidence.weight;

				if (sourcePolicy.multiplier) evidenceContribution *= sourcePolicy.multiplier;
				if (sourcePolicy.cap)
					evidenceContribution = Math.min(evidenceContribution, sourcePolicy.cap);

				if (contribution === 0) {
					ignore(group, evidence);
					continue;
				}

				contribution += evidenceContribution;
			}

			contributionByGroup.set(group, contribution);
		}

		// Process group policies
		for (const [group] of evidencesByGroup) {
			const groupPolicy = evidenceGroupPolicies[group];

			let contribution = contributionByGroup.get(group) ?? 0;

			if (groupPolicy.multiplier) contribution *= groupPolicy.multiplier;
			if (groupPolicy.cap) contribution = Math.min(contribution, groupPolicy.cap);

			contribution = Math.ceil(contribution);
			contributionByGroup.set(group, contribution);

			const normalizedContribution = contribution / (groupPolicy.cap ?? contribution);
			normalizedContributionByGroup.set(group, normalizedContribution);
		}

		// Compute final groups breakdown
		for (const [group] of evidencesByGroup) {
			const contribution = contributionByGroup.get(group) ?? 0;
			const normalizedContribution = normalizedContributionByGroup.get(group) ?? 0;
			const tier = computeGroupTier(normalizedContribution);
			const usedEvidences = usedEvidencesByGroup.get(group);
			const ignoredEvidences = ignoredEvidencesByGroup.get(group) ?? [];
			const evidences = usedEvidences
				? [...usedEvidences, ...ignoredEvidences]
				: [...ignoredEvidences];

			groupsBreakdown.push({
				group,
				contribution,
				normalizedContribution,
				tier,
				evidences,
			});
		}

		const ctx = computeSynergyContext([...usedEvidencesByGroup.values()].flat());
		const synergies = scoreSynergyWithGate(ctx);

		return computeBreakdown({ groups: groupsBreakdown, synergies, penalties });
	};

	return {
		apply: (evidence) => {
			const breakdown = score(evidence);

			return {
				mode: breakdown.mode,
				breakdown,
				score: breakdown.total,
				normalizedScore: breakdown.normalizedTotal,
			};
		},
	};
};
