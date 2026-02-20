import type { EvidenceTier, ScoreEngineLanguage } from "@playatlas/common/domain";
import type { ScoreEnginePattern } from "./engine.lexicon.api";

export type SignalTerm = string | ScoreEnginePattern;
export type SignalAndGroup = SignalTerm[];
export type SignalOrGroup = (SignalTerm | SignalAndGroup)[];

export type CanonicalSignalId = string;

type TextSignalItemBaseProps<TGroup> = {
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	isGate: boolean;
};

export type TextSignalItem<TGroup> = TextSignalItemBaseProps<TGroup> & {
	phrase: SignalOrGroup;
};

export type ExpandedTextSignalItem<TGroup> = TextSignalItem<TGroup> & {
	language: ScoreEngineLanguage;
	signalId: CanonicalSignalId;
};

export type TextSignalItemNoPhrase<TGroup> = TextSignalItemBaseProps<TGroup>;

export type CanonicalTextSignalsMap<TSignalId extends string, TGroup> = Record<
	TSignalId,
	TextSignalItemNoPhrase<TGroup>
>;

type TaxonomySignalItemBaseProps<TGroup> = {
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	isGate: boolean;
};

export type TaxonomySignalItem<TGroup> = TaxonomySignalItemBaseProps<TGroup> & {
	name: SignalOrGroup;
};

export type ExpandedTaxonomySignalItem<TGroup> = TaxonomySignalItem<TGroup> & {
	language: ScoreEngineLanguage;
	signalId: CanonicalSignalId;
};

export type TaxonomySignalItemNoName<TGroup> = TaxonomySignalItemBaseProps<TGroup>;

export type CanonicalTaxonomySignalsMap<TSignalId extends string, TGroup> = Record<
	TSignalId,
	TaxonomySignalItemNoName<TGroup>
>;
