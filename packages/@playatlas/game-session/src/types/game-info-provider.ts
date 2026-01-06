export interface GameInfoProvider {
  getGameName(gameId: string): string | undefined | null;
}
