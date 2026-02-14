export type ScoreEngineScoreCeilingPolicy = {
	withGate: number;
	withoutGate: number;
	tagsOnly: number;
};

export const SCORE_ENGINE_DEFAULT_SCORE_CEILING_POLICY = {
	withGate: 100,
	withoutGate: 15,
	tagsOnly: 30,
} as const satisfies ScoreEngineScoreCeilingPolicy;
