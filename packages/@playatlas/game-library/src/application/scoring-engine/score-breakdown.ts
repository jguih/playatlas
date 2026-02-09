import type { EngineScoreMode } from "@playatlas/common/domain";
import { type StoredEvidence } from "./evidence.types";
import { type Penalty } from "./penalty.types";
import type { Synergy } from "./synergy.types";

export type ScoreBreakdown<TGroup> = {
	mode: EngineScoreMode;
	groups: {
		group: TGroup;
		evidences: StoredEvidence<TGroup>[];
		contribution: number;
	}[];
	synergies: Array<Synergy>;
	subtotal: number;
	penalties: Array<Penalty>;
	total: number;
};
