import { type StoredEvidence } from "./evidence.types";
import { type Penalty } from "./penalty.types";

export type ScoreBreakdown<TGroup> = {
	mode: "with_gate" | "without_gate";
	groups: {
		group: TGroup;
		evidences: StoredEvidence<TGroup>[];
		contribution: number;
	}[];
	synergy: {
		contribution: number;
		details: string;
	};
	subtotal: number;
	penalties: Array<Penalty>;
	total: number;
};
