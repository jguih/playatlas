import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT } from "../../pt.pattern.dict";

describe("Portuguese / RANDOM_LOOT", () => {
	const re = RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT.RANDOM_LOOT;

	const shouldMatch = ["loot aleatório", "itens aleatórios"];

	const shouldNotMatch = ["os itens do inventário são aleatórios"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
