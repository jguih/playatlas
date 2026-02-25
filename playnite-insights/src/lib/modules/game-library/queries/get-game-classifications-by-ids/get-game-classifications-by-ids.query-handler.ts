import type { IGameClassificationRepositoryPort } from "../../infra";
import type { IGetGameClassificationByIdsQueryHandler } from "./get-game-classifications-by-ids.query-handler.port";

export type GetGameClassificationsByIdsQueryHandlerDeps = {
	gameClassificationRepository: IGameClassificationRepositoryPort;
};

export class GetGameClassificationsByIdsQueryHandler implements IGetGameClassificationByIdsQueryHandler {
	constructor(private readonly deps: GetGameClassificationsByIdsQueryHandlerDeps) {}

	executeAsync: IGetGameClassificationByIdsQueryHandler["executeAsync"] = async ({
		gameClassificationIds,
	}) => {
		const ids = Array.isArray(gameClassificationIds)
			? gameClassificationIds
			: [gameClassificationIds];
		const gameClassifications = await this.deps.gameClassificationRepository.getByIdsAsync(ids);
		return {
			gameClassifications: gameClassifications.values().toArray(),
		};
	};
}
