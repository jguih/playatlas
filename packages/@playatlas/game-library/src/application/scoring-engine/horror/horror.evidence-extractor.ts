import { makeEvidenceExtractor } from "../evidence-extractor";
import type { IEvidenceExtractorPort } from "../evidence-extractor.port";
import {
	HORROR_ENGINE_TAXONOMY_SIGNALS,
	HORROR_ENGINE_TEXT_SIGNALS,
	type HorrorEvidenceGroup,
} from "./horror.score-engine.meta";

export type IHorrorEvidenceExtractorPort = IEvidenceExtractorPort<HorrorEvidenceGroup>;

export const makeHorrorEvidenceExtractor = (): IHorrorEvidenceExtractorPort =>
	makeEvidenceExtractor({
		taxonomySignals: HORROR_ENGINE_TAXONOMY_SIGNALS,
		textSignals: HORROR_ENGINE_TEXT_SIGNALS,
	});
