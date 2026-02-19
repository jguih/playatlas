import { normalize } from "@playatlas/common/common";
import { expect, it } from "vitest";

type UniTestPatternProps = {
	regex: RegExp | RegExp[];
	shouldMatch: string[];
	shouldNotMatch: string[];
};

export const unitTestPattern = (props: UniTestPatternProps) => {
	const regexp = Array.isArray(props.regex) ? props.regex : [props.regex];

	it.each(props.shouldMatch)("matches: %s", (text) => {
		expect(regexp.every((r) => r.test(normalize(text)))).toBe(true);
	});

	it.each(props.shouldNotMatch)("does not match: %s", (text) => {
		expect(regexp.every((r) => r.test(normalize(text)))).toBe(false);
	});
};
