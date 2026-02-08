import type { ScoreBreakdownResponseDto } from "../../dtos/scoring-engine/score-breakdown.response.dto";

export type IScoreBreakdownNormalizerPort = {
	normalize(json: string): ScoreBreakdownResponseDto;
};
