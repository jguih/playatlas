import type { IGameClassificationRepositoryPort } from "../../infra";
import type { IGetGameClassificationByGameIdQueryHandler } from "./get-game-classifications-by-game-id.query-handler.port";

export type GetGameClassificationsByGameIdQueryHandlerDeps = {
	gameClassificationRepository: IGameClassificationRepositoryPort;
};

export class GetGameClassificationsByGameIdQueryHandler implements IGetGameClassificationByGameIdQueryHandler {
	constructor(private readonly deps: GetGameClassificationsByGameIdQueryHandlerDeps) {}

	executeAsync: IGetGameClassificationByGameIdQueryHandler["executeAsync"] = async ({ gameId }) => {
		const gameClassifications =
			await this.deps.gameClassificationRepository.getByGameIdAsync(gameId);
		return {
			gameClassifications,
		};
	};
}
