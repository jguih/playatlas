import type { ClassificationId, GameClassificationId, GameId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";

type SyncProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type SoftDeleteProps = {
	deletedAt: Date | null;
	deleteAfter: Date | null;
};

type BaseProps = {
	id: GameClassificationId;
	gameId: GameId;
	classificationId: ClassificationId;
	engineVersion: string;
	breakdownJson: string;
};

export type MakeGameClassificationProps = Partial<SyncProps> & BaseProps & Partial<SoftDeleteProps>;

export type RehydrateGameClassificationProps = SyncProps & BaseProps & SoftDeleteProps;

export type MakeGameClassificationDeps = {
	clock: IClockPort;
};
