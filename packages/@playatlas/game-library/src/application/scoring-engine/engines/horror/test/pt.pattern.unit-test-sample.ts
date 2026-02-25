import type { PatternUnitTestSample } from "../../../test/pattern-unit-test-sample.types";
import {
	HORROR_ENGINE_PATTERN_DICTIONARY_PT as PATTERN,
	type HorrorPatternIdPT,
} from "../regex/pt.pattern.dictionary";

export const horrorPatternUniTestSamplePT = {
	PSYCHOLOGICAL_HORROR: {
		pattern: PATTERN.PSYCHOLOGICAL_HORROR,
		shouldMatch: ["terror psicológico", "terror-psicológico"],
		shouldNotMatch: ["filme de terror"],
	},
	FIRST_PERSON_SHOOTER: {
		pattern: PATTERN.FIRST_PERSON_SHOOTER,
		shouldMatch: ["tiro em primeira pessoa"],
		shouldNotMatch: ["ele atirou pela primeira vez"],
	},
	THIRD_PERSON_SHOOTER: {
		pattern: PATTERN.THIRD_PERSON_SHOOTER,
		shouldMatch: ["tiro em terceira pessoa"],
		shouldNotMatch: ["ele atirou três vezes"],
	},
	DEMONIOS_ZUMBIS: {
		pattern: PATTERN.DEMONIOS_ZUMBIS,
		shouldMatch: ["demônio", "demônios", "zumbi", "zumbis"],
		shouldNotMatch: ["anjo"],
	},
	MUNDO_ATERRORIZANTE: {
		pattern: PATTERN.MUNDO_ATERRORIZANTE,
		shouldMatch: [
			"jornada aterrorizante",
			"mundo sombrio",
			"atmosfera sinistra",
			"mundo apavorante",
		],
		shouldNotMatch: ["mundo tranquilo", "atmosfera repleta de tranquilidade", "jornada agradável"],
	},
	SURVIVAL_HORROR: {
		pattern: PATTERN.SURVIVAL_HORROR,
		shouldMatch: ["terror de sobrevivência"],
		shouldNotMatch: ["terror psicológico"],
	},
	TERROR_ADJ_NOME: {
		pattern: PATTERN.TERROR_ADJ_NOME,
		shouldMatch: ["apavorante", "aterrorizante", "perturbador", "perturbadora", "sinistro"],
		shouldNotMatch: ["tranquilo", "calmo", "aterrizante"],
	},
	MUNDO_REPLETO_DE_TERROR: {
		pattern: PATTERN.MUNDO_REPLETO_DE_TERROR,
		shouldMatch: [
			"mundo repleto de terror",
			"aventura repleta de pavor",
			"aventura cheia de terror",
		],
		shouldNotMatch: ["mundo repleto de lugares para explorar", "aventura cheia de surpresas"],
	},
} as const satisfies PatternUnitTestSample<HorrorPatternIdPT>;
