import type {
	CanonicalClassificationTier,
	EvidenceGroupTier,
	EvidenceSource,
} from "@playatlas/common/domain";
import type { ScoreEngineSourcePolicy } from "./engine.evidence-source.policy";
import type { ScoreEngineEvidenceGroupPolicy } from "./engine.policy";
import type { Evidence, StoredEvidence } from "./evidence.types";
import type { CanonicalSignalId } from "./language";
import type { ScoreEngineSourcePriorityPolicy, ScoreEngineStructuralPenaltyPolicy } from "./policy";
import type { ScoreEngineClassificationTierThresholdPolicy } from "./policy/classification-tier-threshold.policy";
import type { ScoreEngineGatePolicy } from "./policy/gate.policy";
import type { ScoreEngineGroupTierThresholdPolicy } from "./policy/group-tier-threshold.policy";
import type { ScoreBreakdown } from "./score-breakdown";
import type { ScoreEngineEvidenceGroupsMeta } from "./score-engine.types";
import type { IScoringPolicyPort } from "./scoring-policy.port";
import type { ComputeScoreBreakdownProps, EvidenceSignalIdRegistry } from "./scoring-policy.types";

type SynergyContext = {
	groupCount: number;
	distinctSources: Set<EvidenceSource>;
};

export type ScoringPolicyDeps<TGroup extends string> = {
	readonly evidenceGroupMeta: ScoreEngineEvidenceGroupsMeta<TGroup>;
	readonly evidenceGroupPolicies: ScoreEngineEvidenceGroupPolicy<TGroup>;
	readonly evidenceSourcePolicy: ScoreEngineSourcePolicy<TGroup>;
	readonly classificationTierThresholdPolicy: ScoreEngineClassificationTierThresholdPolicy;
	readonly groupTierThresholdPolicy: ScoreEngineGroupTierThresholdPolicy;
	readonly gatePolicy: ScoreEngineGatePolicy<TGroup>;
	readonly structuralPenaltyPolicies: ReadonlyArray<ScoreEngineStructuralPenaltyPolicy<TGroup>>;
	readonly scoreCap: number;
	readonly sourcePriorityPolicy: ScoreEngineSourcePriorityPolicy<TGroup>;
};

export const makeScoringPolicy = <TGroup extends string>({
	evidenceGroupPolicies,
	evidenceSourcePolicy,
	classificationTierThresholdPolicy,
	groupTierThresholdPolicy,
	gatePolicy,
	scoreCap,
	structuralPenaltyPolicies,
	sourcePriorityPolicy,
}: ScoringPolicyDeps<TGroup>): IScoringPolicyPort<TGroup> => {
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

		const semanticTotalAfterPenalty = Math.max(semanticSubtotal + penaltyTotal, 0);

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

	const estimateEvidenceContribution = (group: TGroup, evidence: Evidence<TGroup>): number => {
		let evidenceContribution = evidence.weight;
		const sourcePolicy = evidenceSourcePolicy[group][evidence.source];
		if (sourcePolicy.multiplier) evidenceContribution *= sourcePolicy.multiplier;
		return evidenceContribution;
	};

	const applySourcePolicy = (group: TGroup, evidence: Evidence<TGroup>): number => {
		const sourcePolicy = evidenceSourcePolicy[group][evidence.source];
		let contribution = evidence.weight;

		if (sourcePolicy.multiplier) contribution *= sourcePolicy.multiplier;
		if (sourcePolicy.cap) contribution = Math.min(contribution, sourcePolicy.cap);

		return contribution;
	};

	const selectBestEvidence = (props: {
		group: TGroup;
		evidences: Evidence<TGroup>[];
		onIgnore: (evidence: Evidence<TGroup>) => void;
		shouldProcessEvidence: (evidence: Evidence<TGroup>) => boolean;
		signalIdRegistry: EvidenceSignalIdRegistry<TGroup>;
	}) => {
		const { evidences, group, onIgnore, shouldProcessEvidence, signalIdRegistry } = props;

		const priorityPolicy = sourcePriorityPolicy[group];
		let bestEvidence: Evidence<TGroup> | undefined;
		let bestEvidenceEstimatedContribution: number = 0;

		for (const evidence of evidences) {
			if (!shouldProcessEvidence(evidence)) continue;
			if (signalIdRegistry.wasUsed(evidence)) {
				onIgnore(evidence);
				continue;
			}

			const evidenceContribution = estimateEvidenceContribution(group, evidence);

			const current = bestEvidence;
			const currentContribution = bestEvidenceEstimatedContribution;

			if (!current || evidenceContribution > currentContribution) {
				bestEvidence = evidence;
				bestEvidenceEstimatedContribution = evidenceContribution;
				if (current) onIgnore(current);
			} else if (
				currentContribution === evidenceContribution &&
				priorityPolicy[evidence.source] > priorityPolicy[current.source]
			) {
				bestEvidence = evidence;
				bestEvidenceEstimatedContribution = evidenceContribution;
				if (current) onIgnore(current);
			} else {
				onIgnore(evidence);
			}

			signalIdRegistry.append(evidence);
		}

		return {
			bestEvidence,
			bestEvidenceEstimatedContribution,
		};
	};

	const score = (
		evidence: Evidence<TGroup>[],
		signalIdRegistry: EvidenceSignalIdRegistry<TGroup>,
	): ScoreBreakdown<TGroup> => {
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
			const { bestEvidence } = selectBestEvidence({
				group,
				evidences,
				shouldProcessEvidence: (evidence) => evidence.tier === "A",
				onIgnore: (evidence) => ignore(group, evidence),
				signalIdRegistry,
			});

			if (!bestEvidence) continue;

			const bestEvidenceContribution = applySourcePolicy(group, bestEvidence);
			contributionByGroup.set(group, bestEvidenceContribution);

			use(group, bestEvidence, bestEvidenceContribution);
		}

		// Process Tier B evidences by group
		for (const [group, evidences] of evidencesByGroup) {
			const remainingEvidences: Evidence<TGroup>[] = [];

			const addRemaining = (evidence: Evidence<TGroup>) => {
				remainingEvidences.push(evidence);
			};

			const { bestEvidence } = selectBestEvidence({
				group,
				evidences,
				shouldProcessEvidence: (evidence) => evidence.tier === "B",
				onIgnore: addRemaining,
				signalIdRegistry,
			});

			let totalContribution = contributionByGroup.get(group) ?? 0;

			if (bestEvidence) {
				const bestContribution = applySourcePolicy(group, bestEvidence);
				use(group, bestEvidence, bestContribution);
				totalContribution += bestContribution;
			}

			for (let i = 0; i < remainingEvidences.length; i++) {
				const evidence = remainingEvidences[i];

				const basePenalty = 0.7;
				const incremental = 0.1;

				const penaltyRate = Math.min(basePenalty + i * incremental, 0.95);

				const contribution = applySourcePolicy(group, evidence);
				use(group, evidence, contribution);
				totalContribution += contribution;

				penalties.push({
					contribution: contribution * penaltyRate * -1,
					details: `${(penaltyRate * 100).toFixed(0)}% of ~${contribution.toFixed(2)} as penalty from evidence ${evidence.signalId}: ${remainingEvidences.length} Tier B evidences scored in group ${group}`,
					type: "evidence_stacking",
				});

				signalIdRegistry.append(evidence);
			}

			contributionByGroup.set(group, totalContribution);
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
				if (signalIdRegistry.wasUsed(evidence)) {
					ignore(group, evidence);
					continue;
				}

				if (contribution === 0) {
					ignore(group, evidence);
					continue;
				}

				const evidenceContribution = applySourcePolicy(group, evidence);
				use(group, evidence, evidenceContribution);

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

			contribution = Math.max(contribution, 0);
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
			const signalIdRegistry = new Set<CanonicalSignalId>();

			const evidenceSignalIdRegistry: EvidenceSignalIdRegistry<TGroup> = {
				append: (evidence) => signalIdRegistry.add(evidence.signalId),
				wasUsed: (evidence) => signalIdRegistry.has(evidence.signalId),
			};

			const breakdown = score(evidence, evidenceSignalIdRegistry);

			return {
				mode: breakdown.mode,
				breakdown,
				score: breakdown.total,
				normalizedScore: breakdown.normalizedTotal,
			};
		},
	};
};
