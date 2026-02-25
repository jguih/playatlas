export const SCORE_ENGINE_LANGUAGE_EN = "en" as const satisfies string;

export const scoreEngineLanguages = [SCORE_ENGINE_LANGUAGE_EN, "pt"] as const satisfies string[];

export type ScoreEngineLanguage = (typeof scoreEngineLanguages)[number];
