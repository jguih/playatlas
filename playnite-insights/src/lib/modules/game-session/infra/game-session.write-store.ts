import { IndexedDbRepository, type IndexedDbRepositoryDeps } from "$lib/modules/common/infra";
import type { GameSessionResponseDto } from "@playatlas/game-session/dtos";
import type { IGameSessionReadModelMapperPort } from "../application";
import { gameSessionStoreMeta } from "./game-session.store.schema";

export type IGameSessionWriteStorePort = {
	upsertAsync: (props: {
		gameSessionDto: GameSessionResponseDto | GameSessionResponseDto[];
	}) => Promise<void>;
};

export type GameSessionWriteStoreDeps = IndexedDbRepositoryDeps & {
	gameSessionMapper: IGameSessionReadModelMapperPort;
};

export class GameSessionWriteStore
	extends IndexedDbRepository
	implements IGameSessionWriteStorePort
{
	private readonly meta = gameSessionStoreMeta;

	constructor(private readonly deps: GameSessionWriteStoreDeps) {
		super(deps);
	}

	upsertAsync: IGameSessionWriteStorePort["upsertAsync"] = async ({ gameSessionDto }) => {
		const gameSessions = Array.isArray(gameSessionDto) ? gameSessionDto : [gameSessionDto];

		return await this.runTransaction([this.meta.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.meta.storeName);

			const promises = gameSessions.map((gs) =>
				this.runRequest(store.put(this.deps.gameSessionMapper.fromDto(gs))),
			);

			await Promise.all(promises);
		});
	};
}
