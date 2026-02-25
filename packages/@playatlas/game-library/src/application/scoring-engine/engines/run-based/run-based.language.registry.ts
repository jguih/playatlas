import type { EngineLanguageRegistry } from "../../language";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./signals/canonical.signals";
import {
	RUN_BASED_ENGINE_TAXONOMY_SIGNALS_EN,
	RUN_BASED_ENGINE_TEXT_SIGNALS_EN,
} from "./signals/en.signals";
import {
	RUN_BASED_ENGINE_TAXONOMY_SIGNALS_PT,
	RUN_BASED_ENGINE_TEXT_SIGNALS_PT,
} from "./signals/pt.signals";

export const RUN_BASED_ENGINE_LANGUAGE_REGISTRY = {
	en: {
		text: RUN_BASED_ENGINE_TEXT_SIGNALS_EN,
		taxonomy: RUN_BASED_ENGINE_TAXONOMY_SIGNALS_EN,
	},
	pt: {
		text: RUN_BASED_ENGINE_TEXT_SIGNALS_PT,
		taxonomy: RUN_BASED_ENGINE_TAXONOMY_SIGNALS_PT,
	},
} as const satisfies EngineLanguageRegistry<RunBasedTextSignalId, RunBasedTaxonomySignalId>;
