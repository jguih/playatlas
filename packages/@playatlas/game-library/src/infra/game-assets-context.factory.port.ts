import type { PlayniteGameId } from "@playatlas/common/domain";
import type { GameAssetsContext } from "./game-assets-context";

export type IGameAssetsContextFactoryPort = {
	buildContext: (playniteGameId: PlayniteGameId) => GameAssetsContext;
};
