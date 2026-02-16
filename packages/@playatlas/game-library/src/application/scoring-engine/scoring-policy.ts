import type { CanonicalClassificationTier, EvidenceSource } from "@playatlas/common/domain";
import type { ScoreEngineClassificationTierThresholdPolicy } from "./engine.classification-tier-threshold.policy";
import type { ScoreEngineSourcePolicy } from "./engine.evidence-source.policy";
import type {
	GateStackPolicy,
	NoGatePolicy,
	ScoreEngineEvidenceGroupPolicy,
} from "./engine.policy";
import type { ScoreEngineScoreCeilingPolicy } from "./engine.score-ceiling.policy";
import type { Evidence, StoredEvidence } from "./evidence.types";
import type { Penalty } from "./penalty.types";
import type { ScoreBreakdown } from "./score-breakdown";
import type { ScoreEngineEvidenceGroupsMeta } from "./score-engine.types";
import type { IScoringPolicyPort } from "./scoring-policy.port";
import type { ComputeScoreBreakdownProps } from "./scoring-policy.types";

type SynergyContext = {
	groupCount: number;
	distinctSources: Set<EvidenceSource>;
};

export type ScoringPolicyDeps<TGroup extends string> = {
	evidenceGroupMeta: ScoreEngineEvidenceGroupsMeta<TGroup>;
	evidenceGroupPolicies: ScoreEngineEvidenceGroupPolicy<TGroup>;
	evidenceSourcePolicy: ScoreEngineSourcePolicy;
	noGatePolicy: NoGatePolicy;
	gateStackPolicy: GateStackPolicy;
	scoreCeilingPolicy: ScoreEngineScoreCeilingPolicy;
	classificationTierThresholdPolicy: ScoreEngineClassificationTierThresholdPolicy;
};

export const makeScoringPolicy = <TGroup extends string>({
	evidenceGroupPolicies,
	evidenceSourcePolicy,
	scoreCeilingPolicy,
	noGatePolicy,
	gateStackPolicy,
	classificationTierThresholdPolicy,
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

	const hasStrongSignal = (evidence: Evidence<TGroup>[]): boolean => {
		for (const e of evidence) {
			if (e.tier === "A" || e.tier === "B") {
				return true;
			}
		}
		return false;
	};

	const computeClassificationTier = (normalizedScore: number): CanonicalClassificationTier => {
		if (normalizedScore === 0) return "none";
		if (normalizedScore >= classificationTierThresholdPolicy.core) return "core";
		if (normalizedScore >= classificationTierThresholdPolicy.strong) return "strong";
		if (normalizedScore >= classificationTierThresholdPolicy.adjacent) return "adjacent";
		return "weak";
	};

	const estimateContribution = (evidence: Evidence<TGroup>): number => {
		const groupPolicy = evidenceGroupPolicies[evidence.group];
		const sourcePolicy = evidenceSourcePolicy[evidence.source];
		let contribution: number = evidence.weight;

		if (groupPolicy.multiplier) contribution *= groupPolicy.multiplier;
		if (sourcePolicy.multiplier) contribution *= sourcePolicy.multiplier;

		return contribution;
	};

	const applyTagOnlyPenalty = ({
		groups,
		total,
	}: Pick<ComputeScoreBreakdownProps<TGroup>, "groups"> & { total: number }):
		| Penalty
		| undefined => {
		const uniqueSources = new Set<EvidenceSource>();

		for (const group of groups) {
			for (const evidence of group.evidences) {
				if (evidence.status === "ignored") continue;
				uniqueSources.add(evidence.source);
			}
		}

		if (uniqueSources.size === 1 && uniqueSources.has("tag")) {
			const rawContribution = scoreCeilingPolicy.tagsOnly - total;
			const contribution = rawContribution < 0 ? rawContribution : 0;

			return {
				type: "tags_only",
				contribution,
				details: `Score capped to ${scoreCeilingPolicy.tagsOnly} because only tags provided evidence`,
			};
		}
	};

	const computeBreakdown = (props: ComputeScoreBreakdownProps<TGroup>): ScoreBreakdown<TGroup> => {
		const { mode, groups, synergies, penalties } = props;

		let total = 0;

		for (const group of groups) {
			total += group.contribution;
		}

		const groupSubtotal = total;

		const groupsWithPercent: ScoreBreakdown<TGroup>["groups"] = groups.map((group) => ({
			...group,
			contributionPercent: groupSubtotal === 0 ? 0 : group.contribution / groupSubtotal,
		}));

		for (const synergy of synergies) {
			total += synergy.contribution;
		}

		const subtotal = total;

		for (const penalty of penalties) {
			total += penalty.contribution;
		}

		const tagOnlyPenalty = applyTagOnlyPenalty({ groups, total });
		if (tagOnlyPenalty) {
			penalties.push(tagOnlyPenalty);
			total = Math.min(total, scoreCeilingPolicy.tagsOnly);
		} else if (mode === "with_gate") {
			total = Math.min(total, scoreCeilingPolicy.withGate);
		} else if (mode === "without_gate") {
			total = Math.min(total, scoreCeilingPolicy.withoutGate);
		}

		const normalizedTotal =
			mode === "with_gate"
				? 0.15 + (total / scoreCeilingPolicy.withGate) * 0.85
				: (total / scoreCeilingPolicy.withoutGate) * 0.15;
		const tier = computeClassificationTier(normalizedTotal);

		const breakdown: ScoreBreakdown<TGroup> = {
			mode,
			groups: groupsWithPercent,
			synergies,
			subtotal,
			penalties,
			total,
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

	const selectStrongestEvidence = (evidences: Evidence<TGroup>[]) => {
		const ignoredEvidences: Evidence<TGroup>[] = [];
		let strongestEvidence: Evidence<TGroup> | undefined;

		for (const evidence of evidences) {
			const ignore = (evidence: Evidence<TGroup>) => {
				ignoredEvidences.push(evidence);
			};

			if (evidence.tier === "C") {
				ignore(evidence);
				continue;
			}

			const strongestContribution = strongestEvidence ? estimateContribution(strongestEvidence) : 0;
			const evidenceContribution = estimateContribution(evidence);

			if (!strongestEvidence || evidenceContribution > strongestContribution) {
				strongestEvidence = evidence;
			} else {
				ignore(evidence);
			}
		}

		return { strongestEvidence, ignoredEvidences };
	};

	const applyNoGatePolicy = (strongestEvidence: Evidence<TGroup>): Penalty => {
		const rawRatio = noGatePolicy.tierPenalty[strongestEvidence.tier];
		const ratio = Math.max(0, Math.min(rawRatio, 1));
		const penaltyMagnitude = Math.floor(strongestEvidence.weight * ratio);
		const penalty = -Math.min(penaltyMagnitude, strongestEvidence.weight);

		return {
			contribution: penalty,
			type: "no_gate",
			details: `${ratio * 100}% of ${strongestEvidence.weight} from group ${strongestEvidence.group}`,
		};
	};

	const applyGateStackPolicy = (
		contribution: number,
		counter: number,
		group: TGroup,
	): Penalty | undefined => {
		const rawRatio =
			gateStackPolicy.diminishingMultipliers.at(counter) ?? gateStackPolicy.tailMultiplier;
		const ratio = 1 - Math.max(0, Math.min(rawRatio, 1));
		const penaltyContribution = -Math.floor(contribution * ratio);

		if (penaltyContribution === 0) return;

		return {
			type: "multiple_gates",
			contribution: penaltyContribution,
			details: `${Math.floor(ratio * 100)}% of ${contribution} from group ${group}`,
		};
	};

	const scoreSynergyWithoutGate = (ctx: SynergyContext): ScoreBreakdown<TGroup>["synergies"] => {
		let total = 0;
		let details: string = "scored in less than 2 groups";

		if (ctx.groupCount === 2) {
			total = 3;
			details = `scored in 2 groups`;
		} else if (ctx.groupCount >= 3) {
			total = 4;
			details = `scored in 3 groups or more`;
		}

		return [
			{
				type: "multiple_sources",
				contribution: Math.floor(total),
				details,
			},
		];
	};

	const scoreWithoutGate = (evidences: Evidence<TGroup>[]): ScoreBreakdown<TGroup> => {
		const groupsBreakdown: ComputeScoreBreakdownProps<TGroup>["groups"] = [];
		const penalties: ComputeScoreBreakdownProps<TGroup>["penalties"] = [];
		const { strongestEvidence, ignoredEvidences } = selectStrongestEvidence(evidences);
		const ignoredStoredEvidences: StoredEvidence<TGroup>[] = ignoredEvidences.map((e) => ({
			...e,
			status: "ignored",
			contribution: 0,
		}));
		let strongestStoredEvidence: StoredEvidence<TGroup> | undefined;

		if (!strongestEvidence)
			return computeBreakdown({
				mode: "without_gate",
				groups: [],
				synergies: [],
				penalties: [],
			});

		if (strongestEvidence.tier === "A" || strongestEvidence.tier === "B") {
			const penalty = applyNoGatePolicy(strongestEvidence);
			penalties.push(penalty);

			strongestStoredEvidence = {
				...strongestEvidence,
				status: "used",
				contribution: strongestEvidence.weight,
			};
		}

		groupsBreakdown.push({
			group: strongestEvidence.group,
			evidences: strongestStoredEvidence
				? [strongestStoredEvidence, ...ignoredStoredEvidences]
				: [...ignoredStoredEvidences],
			contribution: strongestEvidence.weight,
		});

		const ctx = computeSynergyContext([strongestEvidence]);
		const synergies = scoreSynergyWithoutGate(ctx);

		return computeBreakdown({
			mode: "without_gate",
			groups: groupsBreakdown,
			synergies,
			penalties,
		});
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

	const scoreWithGate = (evidence: Evidence<TGroup>[]): ScoreBreakdown<TGroup> => {
		const evidencesByGroup = joinByGroup(evidence);
		const bestEvidenceByGroup = new Map<TGroup, Evidence<TGroup>>();
		const bestStoredEvidenceByGroup = new Map<TGroup, StoredEvidence<TGroup>>();
		const ignoredEvidencesByGroup = new Map<TGroup, Evidence<TGroup>[]>();
		const ignoredStoredEvidencesByGroup = new Map<TGroup, StoredEvidence<TGroup>[]>();
		const contributionByGroup = new Map<TGroup, number>();
		const groupsBreakdown: ComputeScoreBreakdownProps<TGroup>["groups"] = [];
		const penalties: ComputeScoreBreakdownProps<TGroup>["penalties"] = [];
		let gateCounter = 0;

		// Get best evidence per group and ignore all the rest
		for (const [group, evidences] of evidencesByGroup) {
			const hasStrong = hasStrongSignal(evidences);

			for (const evidence of evidences) {
				const ignore = (evidence: Evidence<TGroup>) => {
					const ignoredList = ignoredEvidencesByGroup.get(group);
					if (!ignoredList) ignoredEvidencesByGroup.set(group, []);
					ignoredEvidencesByGroup.get(group)!.push(evidence);
				};

				if (evidence.tier === "C" && !hasStrong) {
					ignore(evidence);
					continue;
				}

				const current = bestEvidenceByGroup.get(group);
				const currentContribution = current ? estimateContribution(current) : 0;
				const evidenceContribution = estimateContribution(evidence);

				if (!current || evidenceContribution > currentContribution) {
					bestEvidenceByGroup.set(group, evidence);
					if (current) ignore(current);
				} else if (
					currentContribution === evidenceContribution &&
					SOURCE_PRIORITY[evidence.source] > SOURCE_PRIORITY[current.source]
				) {
					bestEvidenceByGroup.set(group, evidence);
					if (current) ignore(current);
				} else {
					ignore(evidence);
				}
			}
		}

		// Compute contribution of all best evidences per group
		for (const [group, evidence] of bestEvidenceByGroup) {
			const groupPolicy = evidenceGroupPolicies[group];
			const sourcePolicy = evidenceSourcePolicy[evidence.source];
			let contribution: number = evidence.weight;

			if (groupPolicy.multiplier) contribution *= groupPolicy.multiplier;
			if (groupPolicy.cap) contribution = Math.min(contribution, groupPolicy.cap);

			if (gateCounter > 0 && evidence.isGate) {
				const penalty = applyGateStackPolicy(contribution, gateCounter, group);
				if (penalty) penalties.push(penalty);
			}

			if (sourcePolicy.multiplier) contribution *= sourcePolicy.multiplier;
			if (sourcePolicy.cap) contribution = Math.min(contribution, sourcePolicy.cap);

			contributionByGroup.set(group, contribution);

			bestStoredEvidenceByGroup.set(group, {
				...evidence,
				status: "used",
				contribution,
			});

			if (evidence.isGate) gateCounter++;
		}

		// Expand ignored evidences
		for (const [group, evidences] of ignoredEvidencesByGroup) {
			for (const evidence of evidences) {
				const current = ignoredStoredEvidencesByGroup.get(group);
				if (!current) ignoredStoredEvidencesByGroup.set(group, []);
				ignoredStoredEvidencesByGroup
					.get(group)!
					.push({ ...evidence, status: "ignored", contribution: 0 });
			}
		}

		// Compute final groups breakdown
		for (const [group] of evidencesByGroup) {
			const contribution = contributionByGroup.get(group) ?? 0;
			const bestEvidence = bestStoredEvidenceByGroup.get(group);
			const ignoredEvidences = ignoredStoredEvidencesByGroup.get(group) ?? [];
			const evidences = bestEvidence ? [bestEvidence, ...ignoredEvidences] : [...ignoredEvidences];

			groupsBreakdown.push({
				group,
				contribution,
				evidences,
			});
		}

		const ctx = computeSynergyContext([...bestEvidenceByGroup.values()]);
		const synergies = scoreSynergyWithGate(ctx);

		return computeBreakdown({ mode: "with_gate", groups: groupsBreakdown, synergies, penalties });
	};

	return {
		apply: (evidence) => {
			const gateEvidence = evidence.filter((e) => e.isGate);
			const nonGateEvidence = evidence.filter((e) => !e.isGate);
			const hasGate = gateEvidence.length > 0;

			if (!hasGate) {
				const breakdown = scoreWithoutGate(nonGateEvidence);

				return {
					mode: "without_gate",
					score: breakdown.total,
					normalizedScore: breakdown.normalizedTotal,
					breakdown,
				};
			}

			const breakdown = scoreWithGate(evidence);
			return {
				mode: "with_gate",
				score: breakdown.total,
				normalizedScore: breakdown.normalizedTotal,
				breakdown,
			};
		},
	};
};
