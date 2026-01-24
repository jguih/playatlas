export interface IGameLibrarySyncStatePort {
	getLastServerSync(): Date | null;
	setLastServerSync(date: Date): void;
}
