import type {
	IGameSessionReadonlyStore,
	IGameSessionWriteStorePort,
} from "$lib/modules/game-session/infra";

export type IClientGameSessionModulePort = {
	get gameSessionWriteStore(): IGameSessionWriteStorePort;
	get gameSessionReadonlyStore(): IGameSessionReadonlyStore;
};
