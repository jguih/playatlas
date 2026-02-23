import type { IGameClassificationRepositoryPort } from "../../infra";
import type { IGetLatestGameClassificationByGameIdQueryHandler } from "./get-latest-game-classifications-by-game-id.query-handler.port";

export type GetLatestGameClassificationsByGameIdQueryHandlerDeps = {
	gameClassificationRepository: IGameClassificationRepositoryPort;
};

export class GetLatestGameClassificationsByGameIdQueryHandler implements IGetLatestGameClassificationByGameIdQueryHandler {
	constructor(private readonly deps: GetLatestGameClassificationsByGameIdQueryHandlerDeps) {}

	executeAsync: IGetLatestGameClassificationByGameIdQueryHandler["executeAsync"] = async ({
		gameId,
	}) => {
		const gameClassifications =
			await this.deps.gameClassificationRepository.getLatestByGameIdAsync(gameId);
		return {
			gameClassifications,
		};
	};
}
