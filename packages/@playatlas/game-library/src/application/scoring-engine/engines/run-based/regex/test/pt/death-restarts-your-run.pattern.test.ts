import { describe } from "vitest";
import { unitTestPattern } from "../../../../../language";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / DEATH_RESTARTS_YOUR_RUN", () => {
	unitTestPattern({
		regex: RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.DEATH_RESTARTS_YOUR_RUN,
		shouldMatch: [
			"a morte reinicia a sua run",
			"a morte reinicia o seu ciclo",
			"a falha reinicia sua run",
		],
		shouldNotMatch: ["a morte é inevitável"],
	});
});
