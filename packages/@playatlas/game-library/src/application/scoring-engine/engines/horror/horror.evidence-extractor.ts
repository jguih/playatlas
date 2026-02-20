import type { ScoreEngineLanguage } from "@playatlas/common/domain";
import { makeEvidenceExtractor } from "../../evidence-extractor";
import type { IEvidenceExtractorPort } from "../../evidence-extractor.port";
import type { IScoreEngineDSLPort } from "../../language";
import { buildTaxonomySignals, buildTextSignals } from "../../score-engine.compiler";
import { HORROR_ENGINE_LANGUAGE_REGISTRY } from "./horror.language.registry";
import { type HorrorEvidenceGroup } from "./horror.score-engine.meta";
import {
	HORROR_ENGINE_CANONICAL_TAXONOMY_SIGNALS,
	HORROR_ENGINE_CANONICAL_TEXT_SIGNALS,
} from "./signals/canonical.signals";

export type IHorrorEvidenceExtractorPort = IEvidenceExtractorPort<HorrorEvidenceGroup>;

export type HorrorEvidenceExtractorDeps = {
	scoreEngineDSL: IScoreEngineDSLPort;
};

export const makeHorrorEvidenceExtractor = (
	deps: HorrorEvidenceExtractorDeps,
): IHorrorEvidenceExtractorPort => {
	const languages: ScoreEngineLanguage[] = ["en", "pt"];
	const languageRegistry = HORROR_ENGINE_LANGUAGE_REGISTRY;

	const textSignals = buildTextSignals({
		canonical: HORROR_ENGINE_CANONICAL_TEXT_SIGNALS,
		languages,
		languageRegistry,
	});

	const taxonomySignals = buildTaxonomySignals({
		canonical: HORROR_ENGINE_CANONICAL_TAXONOMY_SIGNALS,
		languages,
		languageRegistry,
	});

	return makeEvidenceExtractor({
		taxonomySignals,
		textSignals,
		...deps,
	});
};
