import type {
	LanguageTaxonomySignalsMap,
	LanguageTextSignalsMap,
} from "../../score-engine.language.types";
import type { RunBasedTaxonomySignalId, RunBasedTextSignalId } from "./canonical.signals";

export const RUN_BASED_ENGINE_TEXT_SIGNALS_PT = {
	// #region: run_based_identity
	ROGUELIKE_LABEL: ["roguelike", "rogue-like"],
	ROGUELITE_LABEL: ["roguelite", "rogue-lite"],
	RUN_LOOP_LANGUAGE_LABEL: [
		"a cada run",
		"a cada partida",
		"a cada jogo",
		"em cada run",
		"em cada partida",
		"em cada jogo",
		"por run",
		"por partida",
		"por jogo",
		"nova run",
		"nova partida",
		"novo jogo",
		"outra run",
		"outra partida",
		"entre runs",
		"entre partidas",
		"run após run",
		"partida após partida",
		"jogo após jogo",
	],
	TRY_AGAIN_LOOP_LABEL: [
		"tente novamente",
		"tentativa após tentativa",
		"aprenda com o fracasso",
		"falhe e tente de novo",
		"morra e tente novamente",
	],
	// #endregion
	// #region: procedural_runs
	PROCEDURAL_GENERATION_LABEL: [
		"níveis gerados proceduralmente",
		"mundo gerado proceduralmente",
		"levels gerados proceduralmente",
		"geração procedural",
		"masmorras geradas proceduralmente",
	],
	RANDOMIZED_MAPS_LABEL: [
		"fases aleatórias",
		"níveis aleatórios",
		"mapas aleatórios",
		"mapas gerados aleatoriamente",
		"níveis gerados aleatoriamente",
		"rpg de ação gerado aleatoriamente",
		"layouts imprevisíveis",
		"o layout muda a cada vez",
		"o layout muda a cada partida",
		"geração dinâmica de níveis",
		"níveis em constante mudança",
		"castelo em constante mudança",
	],
	EVER_SHIFTING_LABEL: ["em constante mudança", "sempre mudando"],
	CONSTANTLY_CHANGING_ENVIRONMENT_LABEL: [
		"ambientes em constante mudança",
		"ambiente em constante mudança",
		"layout novo a cada jogada",
		"layouts únicos a cada vez",
	],
	// #endregion
	// #region: permadeath_reset
	PERMADEATH_LABEL: ["permadeath", "morte permanente"],
	RESET_ON_DEATH_LABEL: [
		"a morte reinicia sua run",
		"comece de novo após morrer",
		"a run reinicia ao morrer",
		"recomece após falhar",
		"sistema de morte implacável",
	],
	NO_CHECKPOINTS_LABEL: ["sem checkpoints", "sem pontos de controle"],
	// #endregion
	// #region: run_variability
	CUSTOMIZE_YOUR_RUN_LABEL: ["personalize sua run", "customize sua run"],
	DAILY_CHALLENGES: ["desafios diários"],
	RANDOMIZED_ITEMS_LABEL: [
		"itens aleatórios",
		"loot aleatório",
		"melhorias aleatórias",
		"power-ups aleatórios",
		"loot procedural",
		"combinações de efeitos",
		"combinações de itens",
		"variedade de itens",
	],
	BUILD_VARIETY_LABEL: [
		"builds diferentes",
		"builds únicas",
		"variedade de builds",
		"experimente builds",
		"estilos de jogo variados",
		"infinitas combinações de configurações",
		"crie combinações",
	],
	GAMEPLAY_VARIETY_LABEL: [
		"modificações de jogabilidade",
		"nenhuma partida será igual a outra",
		"fases, inimigos e itens aleatórios",
		"nenhuma run é igual",
		"nenhuma partida é igual",
		"nunca experimente o mesmo jogo duas vezes",
		"nenhuma partida será igual a outra",
		"nenhuma partida é igual à outra",
		"cada partida é diferente",
		"cada partida é única",
	],
	ENDLESS_RUN_LABEL: [
		"continue infinitamente",
		"continue seu jogo infinitamente",
		"jogo infinito",
		"sobreviver o máximo possível",
		"veja o quanto você consegue sobreviver",
		"escalonamento infinito",
		["escalonamento", "poder ilimitado"],
	],
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
