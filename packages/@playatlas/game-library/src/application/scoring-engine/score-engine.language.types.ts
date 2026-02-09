import type { SCORE_ENGINE_LANGUAGE_EN, ScoreEngineLanguage } from "@playatlas/common/domain";
import type { SignalRepresentation } from "./engine.signals";

export type LanguageTextSignalsMap<TSignal extends string> = Record<TSignal, SignalRepresentation>;

export type LanguageTaxonomySignalsMap<TSignal extends string> = Record<
	TSignal,
	SignalRepresentation
>;

export type EvidenceSourceLanguageMaps<TTextId extends string, TTaxonomyId extends string> = {
	text: LanguageTextSignalsMap<TTextId>;
	taxonomy: LanguageTaxonomySignalsMap<TTaxonomyId>;
};

export type EngineLanguageRegistry<TTextId extends string, TTaxonomyId extends string> = {
	[SCORE_ENGINE_LANGUAGE_EN]: EvidenceSourceLanguageMaps<TTextId, TTaxonomyId>;
} & Partial<Record<ScoreEngineLanguage, EvidenceSourceLanguageMaps<TTextId, TTaxonomyId>>>;
