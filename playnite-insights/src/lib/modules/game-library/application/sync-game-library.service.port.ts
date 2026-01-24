export interface ISyncGameLibraryServicePort {
	syncGamesAsync: () => Promise<void>;
}
