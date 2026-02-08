import type { HorrorTextSignalId } from "./canonical.signals.types";

export const HORROR_TEXT_SIGNALS_EN = {
	PSYCHOLOGICAL_HORROR_LABEL: ["psychological horror", "psychological horror game"],
	SURVIVAL_HORROR_LABEL: ["survival horror", "survival-horror", "survival horror game"],
	COSMIC_HORROR_LABEL: ["cosmic horror", "cosmic-horror", "cosmic horror game"],
	HORROR_GAME_LABEL: ["horror game", "horror-game"],
	HORROR_ADVENTURE_LABEL: ["horror adventure", "horror-adventure", "horror adventure game"],
} as const satisfies Record<HorrorTextSignalId, readonly string[]>;
