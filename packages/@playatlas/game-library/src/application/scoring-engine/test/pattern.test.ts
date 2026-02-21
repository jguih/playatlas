import { normalize } from "@playatlas/common/common";
import {
	CLASSIFICATION_IDS,
	scoreEngineLanguages,
	type ScoreEngineLanguage,
} from "@playatlas/common/domain";
import { describe, expect, it } from "vitest";
import { makeScoreEngineDSL } from "../language";
import { patternUnitTestSampleRegistry } from "./pattern-unit-test-sample.registry";

const getLangLabel = (lang: ScoreEngineLanguage): string => {
	switch (lang) {
		case "en":
			return "English";
		case "pt":
			return "Portuguese";
	}
};

for (const classificationId of CLASSIFICATION_IDS) {
	for (const lang of scoreEngineLanguages) {
		const sample = patternUnitTestSampleRegistry[classificationId][lang];

		describe(`${classificationId} Score Engine / ${getLangLabel(lang)} Pattern Tests`, () => {
			const dsl = makeScoreEngineDSL();

			for (const [key, { pattern, shouldMatch, shouldNotMatch }] of Object.entries(sample)) {
				const source = dsl.normalizeCompile(pattern);
				const regex = () => new RegExp(source, "gi");

				it.each(shouldMatch)(`${key}: matches: %s`, (text) => {
					expect(regex().test(normalize(text))).toBe(true);
				});

				it.each(shouldNotMatch)(`${key}: does not match: %s`, (text) => {
					expect(regex().test(normalize(text))).toBe(false);
				});
			}
		});
	}
}
