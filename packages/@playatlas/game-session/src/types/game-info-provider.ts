export interface GameInfoProvider {
	getGameInfo(gameId: string): { name: string | null } | null;
}
