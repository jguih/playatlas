import type { ScoreEngineLanguage } from "@playatlas/common/domain";
import { makeEvidenceExtractor } from "../../evidence-extractor";
import type { IEvidenceExtractorPort } from "../../evidence-extractor.port";
import { buildTaxonomySignals, buildTextSignals } from "../../score-engine.compiler";
import { RUN_BASED_ENGINE_LANGUAGE_REGISTRY } from "./run-based.language.registry";
import type { RunBasedEvidenceGroup } from "./run-based.score-engine.meta";
import {
	RUN_BASED_ENGINE_CANONICAL_TAXONOMY_SIGNALS,
	RUN_BASED_ENGINE_CANONICAL_TEXT_SIGNALS,
} from "./signals/canonical.signals";

export type IRunBasedEvidenceExtractorPort = IEvidenceExtractorPort<RunBasedEvidenceGroup>;

export const makeRunBasedEvidenceExtractor = (): IRunBasedEvidenceExtractorPort => {
	const languages: ScoreEngineLanguage[] = ["en", "pt"];
	const languageRegistry = RUN_BASED_ENGINE_LANGUAGE_REGISTRY;

	const textSignals = buildTextSignals({
		canonical: RUN_BASED_ENGINE_CANONICAL_TEXT_SIGNALS,
		languages,
		languageRegistry,
	});

	const taxonomySignals = buildTaxonomySignals({
		canonical: RUN_BASED_ENGINE_CANONICAL_TAXONOMY_SIGNALS,
		languages,
		languageRegistry,
	});

	return makeEvidenceExtractor({
		taxonomySignals,
		textSignals,
	});
};
