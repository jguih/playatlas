import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import {
	makeClosedGameSession,
	makeGameSession,
	makeStaleGameSession,
	rehydrateGameSession,
	type GameSession,
} from "../domain/game-session.entity";
import type {
	MakeClosedGameSessionProps,
	MakeGameSessionProps,
	RehydrateGameSessionProps,
} from "../domain/game-session.types";

export type IGameSessionFactoryPort = IEntityFactoryPort<
	MakeGameSessionProps,
	RehydrateGameSessionProps,
	GameSession
> & {
	createStale: (props: MakeGameSessionProps) => GameSession;
	createClosed: (props: MakeClosedGameSessionProps) => GameSession;
};

export type GameSessionFactoryDeps = {
	clock: IClockPort;
};

export const makeGameSessionFactory = (deps: GameSessionFactoryDeps): IGameSessionFactoryPort => {
	return {
		create: (props) => makeGameSession(props, deps),
		createClosed: (props) => makeClosedGameSession(props, deps),
		createStale: (props) => makeStaleGameSession(props, deps),
		rehydrate: (props) => rehydrateGameSession(props, deps),
	};
};
