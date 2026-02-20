import {
	makeScoreEngineDSL,
	type LanguageTaxonomySignalsMap,
	type LanguageTextSignalsMap,
} from "../../../language";
import type { ScoreEnginePattern } from "../../../language/engine.lexicon.api";
import { RUN_BASED_ENGINE_PATTERN_DICTIONARY_PT as PATTERN } from "../regex/pt.pattern.dictionary";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

const dsl = makeScoreEngineDSL();
const c = (p: ScoreEnginePattern): RegExp => new RegExp(dsl.normalizeCompile(p), "i");

export const RUN_BASED_ENGINE_TEXT_SIGNALS_PT = {
	// #region: run_based_identity
	ROGUELIKE_LABEL: ["roguelike", "rogue-like"],
	ROGUELITE_LABEL: ["roguelite", "rogue-lite"],
	RUN_LOOP_STRUCTURE_LABEL: [c(PATTERN.RESTART_AFTER_DEATH)],
	RUN_LOOP_LANGUAGE_LABEL: [c(PATTERN.RUN_REPETITION), c(PATTERN.RUN_AFTER_RUN)],
	TRY_AGAIN_LOOP_LABEL: [
		c(PATTERN.TRY_AGAIN),
		"aprenda com o fracasso",
		c(PATTERN.DIE_AND_TRY_AGAIN),
	],
	// #endregion
	// #region: procedural_runs
	PROCEDURAL_GENERATION_LABEL: [c(PATTERN.PROCEDURALLY_GENERATED_WORLD)],
	RANDOMLY_GENERATED_MAPS_LABEL: [
		c(PATTERN.RANDOMLY_CREATED_WORLDS),
		"rpg de ação gerado aleatoriamente",
		"rpg de ação gerado de maneira aleatória",
		"geração dinâmica de níveis",
	],
	RANDOM_MAPS_LABEL: [c(PATTERN.RANDOM_WORLDS), c(PATTERN.EVER_CHANGING_WORLDS)],
	EVER_SHIFTING_LABEL: [c(PATTERN.EVER_CHANGING)],
	CONSTANTLY_CHANGING_ENVIRONMENT_LABEL: [c(PATTERN.EVER_CHANGING_ENVIRONMENT)],
	PROCEDURAL_WORLD_INDICATION_LABEL: ["geração procedural"],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: ["permadeath", "morte permanente"],
	RESET_ON_DEATH_LABEL: [
		c(PATTERN.RESTART_AFTER_DEATH),
		c(PATTERN.DEATH_RESTARTS_YOUR_RUN),
		"comece de novo após morrer",
		"comece de novo após falhar",
		c(PATTERN.RUN_RESTARTS_ON_DEATH),
		"sistema de morte implacável",
	],
	NO_CHECKPOINTS_LABEL: ["sem checkpoints", "sem pontos de controle"],
	// #endregion
	// #region: run_variability
	GAMEPLAY_VARIETY_LABEL: [
		c(PATTERN.NO_RUN_IS_THE_SAME),
		"modificações de jogabilidade",
		"fases, inimigos e itens aleatórios",
		"nunca experimente o mesmo jogo duas vezes",
		c(PATTERN.EACH_RUN_IS_DIFFERENT),
	],
	ITEMS_VOLUME_LABEL: [c(PATTERN.LOOT_VOLUME_SPECIFIC)],
	RANDOMIZED_ITEMS_LABEL: [c(PATTERN.RANDOM_LOOT), "loot procedural"],
	ENCOUNTER_VOLUME_LABEL: [c(PATTERN.ENEMY_VOLUME_SPECIFIC)],
	RANDOMIZED_ENCOUNTERS_LABEL: [c(PATTERN.RANDOM_ENEMY)],
	BUILD_VARIETY_LABEL: [
		"builds diferentes",
		"builds únicas",
		"variedade de builds",
		"experimente builds",
		"estilos de jogo variados",
		"infinitas combinações de configurações",
		"crie combinações",
	],
	ENDLESS_RUN_LABEL: [
		"continue infinitamente",
		"continue seu jogo infinitamente",
		"jogo infinito",
		"sobreviver o máximo possível",
		"veja o quanto você consegue sobreviver",
		"escalonamento infinito",
	],
	CUSTOMIZE_YOUR_RUN_LABEL: ["personalize sua run", "customize sua run"],
	BUILD_ITEM_VARIETY_LABEL: [c(PATTERN.VARIETY_OF_BUILD_ITEMS)],
	DAILY_CHALLENGES: ["desafios diários"],
	ENDLESSLY_REPLAYABLE_LABEL: ["rejogabilidade infinita", "altamente rejogável"],
	// #endregion
	// #region: meta_progression
	ROGUELITE_PROGRESSION_LABEL: [
		"progressão roguelite",
		"progressão estilo roguelite",
		"experiência roguelite",
	],
	META_PROGRESSION_SYSTEM_LABEL: ["sistema de meta progressão", "sistema de progressão permanente"],
	PERMANENT_UPGRADES_LABEL: ["melhorias permanentes", "upgrades permanentes"],
	PERMANENT_UNLOCKS_LABEL: ["desbloqueios permanentes", "desbloqueios persistentes"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<RunBasedTextSignalId>;

export const RUN_BASED_ENGINE_TAXONOMY_SIGNALS_PT = {
	// #region: run_based_identity
	ROGUELIKE_TAXONOMY: ["roguelike", "rogue-like"],
	ROGUELITE_TAXONOMY: ["roguelite", "rogue-lite"],
	// #endregion
	// #region: procedural_runs
	PROCEDURAL_GENERATION_TAXONOMY: ["geração procedural", "geração-procedural"],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_TAXONOMY: ["permadeath", "morte permanente"],
	// #endregion
	// #region: run_variability
	REPLAY_VALUE_TAXONOMY: ["rejogabilidade", "alto valor de rejogabilidade", "alta rejogabilidade"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<RunBasedTaxonomySignalId>;
