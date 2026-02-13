import type { EngineLanguageRegistry } from "../score-engine.language.types";
import { type HorrorTaxonomySignalId, type HorrorTextSignalId } from "./signals/canonical.signals";
import {
	HORROR_ENGINE_TAXONOMY_SIGNALS_EN,
	HORROR_ENGINE_TEXT_SIGNALS_EN,
} from "./signals/en.signals";
import {
	HORROR_ENGINE_TAXONOMY_SIGNALS_PT,
	HORROR_ENGINE_TEXT_SIGNALS_PT,
} from "./signals/pt.signals";

export const HORROR_ENGINE_LANGUAGE_REGISTRY = {
	en: {
		text: HORROR_ENGINE_TEXT_SIGNALS_EN,
		taxonomy: HORROR_ENGINE_TAXONOMY_SIGNALS_EN,
	},
	pt: {
		text: HORROR_ENGINE_TEXT_SIGNALS_PT,
		taxonomy: HORROR_ENGINE_TAXONOMY_SIGNALS_PT,
	},
} as const satisfies EngineLanguageRegistry<HorrorTextSignalId, HorrorTaxonomySignalId>;
