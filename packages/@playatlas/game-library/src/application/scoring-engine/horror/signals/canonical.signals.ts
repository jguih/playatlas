import type { TextSignalItemNoPhrase } from "../../engine.signals";
import type { HorrorEvidenceGroup } from "../horror.score-engine.meta";
import type { HorrorTextSignalId } from "./canonical.signals.types";

export const HORROR_CANONICAL_TEXT_SIGNALS = {
	// #region: Tier A
	PSYCHOLOGICAL_HORROR_LABEL: {
		group: "psychological_horror",
		tier: "A",
		weight: 60,
		isGate: true,
	},
	SURVIVAL_HORROR_LABEL: {
		group: "survival_horror",
		tier: "A",
		weight: 45,
		isGate: true,
	},
	COSMIC_HORROR_LABEL: {
		group: "cosmic_horror",
		tier: "A",
		weight: 45,
		isGate: true,
	},
	HORROR_GAME_LABEL: {
		group: "core_horror",
		tier: "A",
		weight: 35,
		isGate: true,
	},
	HORROR_ADVENTURE_LABEL: {
		group: "core_horror",
		tier: "A",
		weight: 35,
		isGate: true,
	},
	// #endregion
} as const satisfies Record<HorrorTextSignalId, TextSignalItemNoPhrase<HorrorEvidenceGroup>>;
