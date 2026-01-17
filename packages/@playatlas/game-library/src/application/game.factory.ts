import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import { makeGame, rehydrateGame, type Game } from "../domain/game.entity";
import type { MakeGameProps, RehydrateGameProps } from "../domain/game.entity.types";

export type IGameFactoryPort = IEntityFactoryPort<MakeGameProps, RehydrateGameProps, Game>;

export type GameFactoryDeps = {
	clock: IClockPort;
};

export const makeGameFactory = (deps: GameFactoryDeps): IGameFactoryPort => {
	return {
		create: (props) => makeGame(props, deps),
		rehydrate: (props) => rehydrateGame(props, deps),
	};
};
