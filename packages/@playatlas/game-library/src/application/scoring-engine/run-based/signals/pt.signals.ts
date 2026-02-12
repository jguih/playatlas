import type {
	LanguageTaxonomySignalsMap,
	LanguageTextSignalsMap,
} from "../../score-engine.language.types";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

export const RUN_BASED_ENGINE_TEXT_SIGNALS_PT = {
	// #region: procedural_runs
	ROGUELIKE_LABEL: ["roguelike", "rogue-like"],
	ROGUELITE_LABEL: ["roguelite", "rogue-lite"],
	PROCEDURAL_GENERATION_LABEL: [
		"níveis gerados proceduralmente",
		"geração procedural",
		"masmorras geradas proceduralmente",
		"masmorras geradas",
	],
	RANDOMIZED_MAPS_LABEL: [
		"níveis aleatórios",
		"mapas aleatórios",
		"mapas gerados aleatoriamente",
		"níveis gerados aleatoriamente",
		"rpg de ação gerado aleatoriamente",
		"layouts imprevisíveis",
		"o layout muda a cada vez",
		"geração dinâmica de níveis",
		"nenhuma run é igual",
		"níveis em constante mudança",
		"castelo em constante mudança",
		"nunca experimente o mesmo jogo duas vezes",
	],
	EVER_SHIFTING_LABEL: ["em constante mudança", "sempre mudando"],
	CONSTANTLY_CHANGING_ENVIRONMENT_LABEL: [
		"ambientes em constante mudança",
		"ambiente em constante mudança",
		"layout novo a cada jogada",
		"layouts únicos a cada vez",
	],
	RUN_LOOP_LANGUAGE_LABEL: [
		"a cada run",
		"em cada run",
		"por run",
		"nova run",
		"outra run",
		"entre runs",
		"run após run",
	],
	TRY_AGAIN_LOOP_LABEL: [
		"tente novamente",
		"tentativa após tentativa",
		"aprenda com o fracasso",
		"falhe e tente de novo",
		"morra e tente novamente",
	],
	DUNGEON_CRAWL_LABEL: [
		"dungeon crawl",
		"dungeon crawler",
		"exploração de masmorras",
		"desça às masmorras",
	],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: ["permadeath", "morte permanente"],
	RESET_ON_DEATH_LABEL: [
		"a morte reinicia sua run",
		"comece de novo após morrer",
		"a run reinicia ao morrer",
		"recomece após falhar",
		"reinicie desde o começo",
		"sistema de morte implacável",
	],
	NO_CHECKPOINTS_LABEL: ["sem checkpoints", "sem pontos de controle"],
	// #endregion
	// #region: run_variability
	CUSTOMIZE_YOUR_RUN_LABEL: ["personalize sua run", "customize sua run"],
	DAILY_CHALLENGES: ["desafios diários"],
	BUILD_VARIETY_LABEL: [
		"itens aleatórios",
		"loot aleatório",
		"melhorias aleatórias",
		"power-ups aleatórios",
		"loot procedural",
	],
	RANDOMIZED_ITEMS_LABEL: [
		"builds diferentes",
		"builds únicas",
		"variedade de builds",
		"experimente builds",
		"estilos de jogo variados",
	],
	ENDLESSLY_REPLAYABLE_LABEL: ["rejogabilidade infinita", "altamente rejogável"],
	// #endregion
	// #region: meta_progression
	ROGUELITE_PROGRESSION_LABEL: ["progressão roguelite", "progressão estilo roguelite"],
	META_PROGRESSION_SYSTEM_LABEL: ["sistema de meta progressão", "sistema de progressão permanente"],
	PERMANENT_UPGRADES_LABEL: ["melhorias permanentes", "upgrades permanentes"],
	PERMANENT_UNLOCKS_LABEL: ["desbloqueios permanentes", "desbloqueios persistentes"],
	// #endregion
} as const satisfies LanguageTextSignalsMap<RunBasedTextSignalId>;

export const RUN_BASED_ENGINE_TAXONOMY_SIGNALS_PT = {
	// #region: procedural_runs
	ROGUELIKE_TAXONOMY: ["roguelike", "rogue-like"],
	ROGUELITE_TAXONOMY: ["roguelite", "rogue-lite"],
	PROCEDURAL_GENERATION_TAXONOMY: ["geração procedural", "geração-procedural"],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_TAXONOMY: ["permadeath", "morte permanente"],
	// #endregion
	// #region: run_variability
	REPLAY_VALUE_TAXONOMY: ["rejogabilidade", "alto valor de rejogabilidade", "alta rejogabilidade"],
	// #endregion
} as const satisfies LanguageTaxonomySignalsMap<RunBasedTaxonomySignalId>;
