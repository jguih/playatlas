import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / TRY_AGAIN", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.TRY_AGAIN;

	const shouldMatch = ["tente novamente", "tente de novo", "tente uma segunda vez"];

	const shouldNotMatch = ["ele tentou ligar o computador novamente"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
