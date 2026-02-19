import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / EVER_CHANGING_ENVIRONMENT", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.EVER_CHANGING_ENVIRONMENT;

	const shouldMatch = [
		"ambientes em constante mudança",
		"ambiente em constante mudança",
		"ambientes que sempre mudam",
	];

	const shouldNotMatch = [
		"o ruído ambiente está mais alto que o normal",
		"o ruído ambiente está mudando constantemente",
	];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
