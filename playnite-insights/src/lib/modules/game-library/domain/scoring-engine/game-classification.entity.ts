import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";
import type { GameClassificationId, GameId } from "$lib/modules/common/domain";
import type { ClassificationId, EngineScoreMode } from "@playatlas/common/domain";
import type { ScoreBreakdown } from "./score-breakdown.record";

export type GameClassificationBreakdown =
	| {
			type: "normalized";
			migrated: boolean;
			breakdown: ScoreBreakdown;
	  }
	| {
			type: "raw";
			payload: unknown;
	  };

export type GameClassification = ClientEntity<GameClassificationId> &
	Readonly<{
		GameId: GameId;
		ClassificationId: ClassificationId;
		Score: number;
		NormalizedScore: number;
		ScoreMode: EngineScoreMode;
		Breakdown: GameClassificationBreakdown;
		DeletedAt: Date | null;
		DeleteAfter: Date | null;
		// Front-end specific
		Sync: EntitySyncStateProps;
	}>;
