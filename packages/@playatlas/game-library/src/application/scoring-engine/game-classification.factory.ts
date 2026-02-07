import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import {
	makeGameClassificationAggregate,
	rehydrateGameClassificationAggregate,
	type GameClassification,
} from "../../domain/scoring-engine/game-classification.entity";
import type {
	MakeGameClassificationProps,
	RehydrateGameClassificationProps,
} from "../../domain/scoring-engine/game-classification.entity.types";

export type IGameClassificationFactoryPort = IEntityFactoryPort<
	MakeGameClassificationProps,
	RehydrateGameClassificationProps,
	GameClassification
>;

export type GameClassificationFactoryDeps = {
	clock: IClockPort;
};

export const makeGameClassificationFactory = (
	deps: GameClassificationFactoryDeps,
): IGameClassificationFactoryPort => {
	return {
		create: (props) => makeGameClassificationAggregate(props, deps),
		rehydrate: (props) => rehydrateGameClassificationAggregate(props, deps),
	};
};
