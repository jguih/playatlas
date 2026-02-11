import { zodJsonParser, type IHttpClientPort } from "$lib/modules/common/application";
import {
	getGameSessionsResponseDtoSchema,
	type GetGameSessionsResponseDto,
} from "@playatlas/game-session/dtos";

export type IGameSessionClientPort = {
	getGameSessionsAsync: (props: {
		lastCursor: string | null;
	}) => Promise<GetGameSessionsResponseDto>;
};

export type GameSessionClientDeps = {
	httpClient: IHttpClientPort;
};

export class GameSessionClient implements IGameSessionClientPort {
	constructor(private readonly deps: GameSessionClientDeps) {}

	getGameSessionsAsync: IGameSessionClientPort["getGameSessionsAsync"] = async ({ lastCursor }) => {
		const response = await this.deps.httpClient.getAsync({
			endpoint: `/api/game/session`,
			searchParams: {
				sinceLastSync: lastCursor,
			},
		});
		return await zodJsonParser(getGameSessionsResponseDtoSchema)(response);
	};
}
