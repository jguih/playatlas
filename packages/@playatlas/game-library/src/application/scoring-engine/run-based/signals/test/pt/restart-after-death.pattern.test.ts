import { normalize } from "@playatlas/common/common";
import { describe, expect, it } from "vitest";
import { PATTERN } from "../../pt.pattern.dict";

describe("Portuguese / RESTART_AFTER_DEATH", () => {
	const re = PATTERN.RESTART_AFTER_DEATH;

	const shouldMatch = [
		"recomeçar toda vez que morre",
		"reiniciar toda vez que morre",
		"recomeçar toda vez que morrer",
		"recomeçar toda vez que ela morre",
		"recomeçar toda vez que ele morre",
		"reiniciar sempre que morre",
		"recomeçar sempre que falhar",
	];

	const shouldNotMatch = ["reiniciar o computador sempre que morre a bateria"];

	it.each(shouldMatch)("matches: %s", (text) => {
		expect(re.test(normalize(text))).toBe(true);
	});

	it.each(shouldNotMatch)("does not match: %s", (text) => {
		expect(re.test(normalize(text))).toBe(false);
	});
});
