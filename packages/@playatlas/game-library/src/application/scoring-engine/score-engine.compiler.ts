import type { ScoreEngineLanguage } from "@playatlas/common/domain";
import type {
	CanonicalTaxonomySignalsMap,
	CanonicalTextSignalsMap,
	ExpandedTaxonomySignalItem,
	ExpandedTextSignalItem,
} from "./engine.signals";
import type { EngineLanguageRegistry } from "./score-engine.language.types";

export const buildTextSignals = <
	TTextId extends string,
	TTaxonomyId extends string,
	TGroup,
>(props: {
	languages: ScoreEngineLanguage[];
	canonical: CanonicalTextSignalsMap<TTextId, TGroup>;
	languageRegistry: EngineLanguageRegistry<TTextId, TTaxonomyId>;
}): ExpandedTextSignalItem<TGroup>[] => {
	const languageSet = new Set<ScoreEngineLanguage>(["en"]);

	for (const lang of props.languages) {
		languageSet.add(lang);
	}

	const result: ExpandedTextSignalItem<TGroup>[] = [];

	for (const language of languageSet) {
		const pack = props.languageRegistry[language]?.text;
		if (!pack) continue;

		for (const signalId in props.canonical) {
			const canonical = props.canonical[signalId];
			const phrase = pack[signalId];

			result.push({
				...canonical,
				phrase,
				language,
				signalId,
			});
		}
	}

	return result;
};

export const buildTaxonomySignals = <
	TTextId extends string,
	TTaxonomyId extends string,
	TGroup,
>(props: {
	languages: ScoreEngineLanguage[];
	canonical: CanonicalTaxonomySignalsMap<TTaxonomyId, TGroup>;
	languageRegistry: EngineLanguageRegistry<TTextId, TTaxonomyId>;
}): ExpandedTaxonomySignalItem<TGroup>[] => {
	const languageSet = new Set<ScoreEngineLanguage>(["en"]);

	for (const lang of props.languages) {
		languageSet.add(lang);
	}

	const result: ExpandedTaxonomySignalItem<TGroup>[] = [];

	for (const language of languageSet) {
		const pack = props.languageRegistry[language]?.taxonomy;
		if (!pack) continue;

		for (const signalId in props.canonical) {
			const canonical = props.canonical[signalId];
			const name = pack[signalId];

			result.push({
				...canonical,
				name,
				language,
				signalId,
			});
		}
	}

	return result;
};
