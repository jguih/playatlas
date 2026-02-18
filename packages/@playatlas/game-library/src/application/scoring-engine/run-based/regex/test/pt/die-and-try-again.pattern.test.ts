import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / DIE_AND_TRY_AGAIN", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.DIE_AND_TRY_AGAIN;

	const shouldMatch = [
		"morra e tente novamente",
		"falhe e tente de novo",
		"morra e tente uma segunda vez",
		"morra, e então tente novamente",
	];

	const shouldNotMatch = ["ele tentou ligar o computador novamente"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
