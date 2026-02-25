import type { GameId, PlayniteGameId } from "@playatlas/common/domain";

export interface GameInfoProvider {
	getGameInfo(gameId: PlayniteGameId): { id: GameId; name: string | null } | null;
}
