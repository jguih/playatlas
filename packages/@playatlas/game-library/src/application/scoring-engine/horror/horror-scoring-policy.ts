import type { IGenreScoringPolicyPort } from "../genre-scorer.ports";
import type { EvidenceSource } from "../genre-scorer.types";
import { HORROR_GROUP_POLICY } from "./horror.signals";
import type { HorrorEvidence, HorrorEvidenceGroup } from "./horror.types";

export type IHorrorScoringPolicyPort = IGenreScoringPolicyPort<HorrorEvidenceGroup>;

type SynergyContext = {
	groupCount: number;
	distinctSources: Set<EvidenceSource>;
};

export const makeHorrorScoringPolicy = (): IHorrorScoringPolicyPort => {
	const collapseByGroup = (evidence: HorrorEvidence[]) => {
		const best = new Map<HorrorEvidenceGroup, HorrorEvidence>();

		for (const e of evidence) {
			const current = best.get(e.group);
			if (!current || e.weight > current.weight) {
				best.set(e.group, e);
			}
		}

		return [...best.values()];
	};

	const hasStrongSignal = (evidence: HorrorEvidence[]): boolean => {
		for (const e of evidence) {
			if (e.tier === "A" || e.tier === "B") {
				return true;
			}
		}
		return false;
	};

	const computeSynergyContext = (evidence: HorrorEvidence[]): SynergyContext => {
		const groups = new Set<HorrorEvidenceGroup>();
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

	const scoreSynergy = (ctx: SynergyContext, add: (x: HorrorEvidence) => void) => {
		if (ctx.groupCount < 2) return 0;

		const sourceCount = ctx.distinctSources.size;

		let total = 0;

		if (sourceCount === 2) {
			total = 5;
		} else if (sourceCount >= 3) {
			total = 10;
		}

		if (total > 0) {
			add({
				source: "synergy",
				sourceHint: `${ctx.groupCount} groups, ${sourceCount} sources`,
				match: sourceCount,
				weight: total,
				group: "synergy",
				tier: "A",
				isGate: false,
			});
		}

		if (HORROR_GROUP_POLICY.synergy.cap) {
			total = Math.min(total, HORROR_GROUP_POLICY.synergy.cap);
		}

		if (HORROR_GROUP_POLICY.synergy.multiplier) {
			total *= HORROR_GROUP_POLICY.synergy.multiplier;
		}

		return total;
	};

	const scoreWithoutGate = (evidence: HorrorEvidence[]): number => {
		const tierB = evidence.filter((e) => e.tier === "B");

		if (tierB.length === 0) return 0;

		return Math.min(Math.max(...tierB.map((e) => e.weight)), 10);
	};

	const scoreWithGate = (
		evidence: HorrorEvidence[],
		add: (evidence: HorrorEvidence) => void,
	): number => {
		const groupScore = new Map<HorrorEvidenceGroup, number>();
		const hasStrong = hasStrongSignal(evidence);
		const gateEvidence = evidence.filter((e) => e.isGate);
		const hasGate = gateEvidence.length > 0;
		let total = 0;

		for (const e of evidence) {
			if (e.tier === "C" && !hasStrong) continue;
			const prev = groupScore.get(e.group) ?? 0;
			groupScore.set(e.group, e.weight + prev);
		}

		for (const [group, score] of groupScore) {
			const policy = HORROR_GROUP_POLICY[group];

			let value = score;

			if (policy?.cap) {
				value = Math.min(value, policy.cap);
			}

			if (policy?.multiplier) {
				value *= policy.multiplier;
			}

			total += value;
		}

		if (hasGate) {
			const ctx = computeSynergyContext(evidence);
			total += scoreSynergy(ctx, add);
		}

		return total;
	};

	const sortFinalEvidence = (evidence: HorrorEvidence[]) =>
		evidence.sort((a, b) => {
			if (a.tier === "A" && b.tier === "B") return -1;
			if (a.tier === "A" && b.tier === "C") return -1;
			if (a.tier === "B" && b.tier === "C") return -1;
			if (a.tier === "C" && b.tier !== "C") return 1;
			return 0;
		});

	return {
		apply: (evidence) => {
			const finalEvidence = collapseByGroup(evidence);
			const gateEvidence = finalEvidence.filter((e) => e.isGate);
			const nonGateEvidence = finalEvidence.filter((e) => !e.isGate);
			const hasGate = gateEvidence.length > 0;
			let total = 0;

			const add = (x: HorrorEvidence) => finalEvidence.push(x);

			if (!hasGate) {
				total = scoreWithoutGate(nonGateEvidence);

				return {
					score: Math.min(total, 40),
					evidence: sortFinalEvidence(nonGateEvidence),
				};
			}

			total = scoreWithGate(finalEvidence, add);

			return {
				score: Math.min(total, 100),
				evidence: sortFinalEvidence(finalEvidence),
			};
		},
	};
};
