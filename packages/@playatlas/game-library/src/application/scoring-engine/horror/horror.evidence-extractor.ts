import { makeEvidenceExtractor } from "../evidence-extractor";
import type { IEvidenceExtractorPort } from "../genre-scorer.ports";
import { HORROR_TAXONOMY_SIGNALS, HORROR_TEXT_SIGNALS } from "./horror.signals";
import type { HorrorEvidenceGroup } from "./horror.types";

export type IHorrorEvidenceExtractorPort = IEvidenceExtractorPort<HorrorEvidenceGroup>;

export const makeHorrorEvidenceExtractor = (): IHorrorEvidenceExtractorPort =>
	makeEvidenceExtractor({
		taxonomySignals: HORROR_TAXONOMY_SIGNALS,
		textSignals: HORROR_TEXT_SIGNALS,
	});
