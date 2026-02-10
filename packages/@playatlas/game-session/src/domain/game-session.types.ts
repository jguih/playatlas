import type { GameId, GameSessionId, GameSessionStatus } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";

type ClosedSessionProps = {
	endTime: Date | null;
	duration: number | null;
};

type BaseProps = {
	sessionId: GameSessionId;
	startTime: Date;
	status: GameSessionStatus;
	gameId: GameId;
	gameName: string | null;
};

type SyncProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type SoftDeleteProps = {
	deletedAt: Date | null;
	deleteAfter: Date | null;
};

export type BuildGameSessionProps = Partial<SyncProps> &
	Partial<ClosedSessionProps> &
	BaseProps &
	Partial<SoftDeleteProps>;

export type MakeGameSessionProps = Omit<BaseProps, "status">;

export type MakeClosedGameSessionProps = MakeGameSessionProps & ClosedSessionProps;

export type CloseGameSessionProps = {
	endTime: Date;
	duration: number;
};

export type RehydrateGameSessionProps = SyncProps &
	ClosedSessionProps &
	BaseProps &
	SoftDeleteProps;

export type MakeGameSessionDeps = {
	clock: IClockPort;
};
