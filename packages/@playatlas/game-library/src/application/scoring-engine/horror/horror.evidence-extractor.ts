import { makeEvidenceExtractor } from "../evidence-extractor";
import type { IEvidenceExtractorPort } from "../evidence-extractor.port";
import type { HorrorEvidenceGroup } from "./horror.groups";
import { HORROR_TAXONOMY_SIGNALS, HORROR_TEXT_SIGNALS } from "./horror.signals";

export type IHorrorEvidenceExtractorPort = IEvidenceExtractorPort<HorrorEvidenceGroup>;

export const makeHorrorEvidenceExtractor = (): IHorrorEvidenceExtractorPort =>
	makeEvidenceExtractor({
		taxonomySignals: HORROR_TAXONOMY_SIGNALS,
		textSignals: HORROR_TEXT_SIGNALS,
	});
