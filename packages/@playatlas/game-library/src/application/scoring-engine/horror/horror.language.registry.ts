import type { EngineLanguageRegistry } from "../score-engine.language.types";
import { type HorrorTaxonomySignalId, type HorrorTextSignalId } from "./signals/canonical.signals";
import {
	HORROR_ENGINE_TAXONOMY_SIGNALS_EN,
	HORROR_ENGINE_TEXT_SIGNALS_EN,
} from "./signals/en.signals";

export const HORROR_ENGINE_LANGUAGE_REGISTRY: EngineLanguageRegistry<
	HorrorTextSignalId,
	HorrorTaxonomySignalId
> = {
	en: {
		text: HORROR_ENGINE_TEXT_SIGNALS_EN,
		taxonomy: HORROR_ENGINE_TAXONOMY_SIGNALS_EN,
	},
} as const;
