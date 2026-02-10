import type { EngineScoreMode } from "@playatlas/common/domain";
import type { Evidence } from "./evidence.record";
import type { Penalty } from "./penalty.record";
import type { Synergy } from "./synergy.record";

export type ScoreBreakdown = {
	mode: EngineScoreMode;
	groups: {
		group: string;
		evidences: Array<Evidence>;
		contribution: number;
	}[];
	synergies: Array<Synergy>;
	subtotal: number;
	penalties: Array<Penalty>;
	total: number;
};
