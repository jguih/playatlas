import type { IGameVectorProjectionServicePort } from "../../application/recommendation-engine/game-vector-projection.service";
import type { IGetGameVectorsQueryHandlerPort } from "./get-game-vectors.query-handler.port";

export type GetGameVectorsQueryHandlerDeps = {
	gameVectorProjectionService: IGameVectorProjectionServicePort;
};

export class GetGameVectorsQueryHandler implements IGetGameVectorsQueryHandlerPort {
	constructor(private readonly deps: GetGameVectorsQueryHandlerDeps) {}

	executeAsync: IGetGameVectorsQueryHandlerPort["executeAsync"] = async () => {
		const gameVectors = await this.deps.gameVectorProjectionService.buildAsync();
		return { gameVectors };
	};
}
