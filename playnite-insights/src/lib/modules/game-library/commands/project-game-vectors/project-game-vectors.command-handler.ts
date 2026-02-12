import type { IAsyncCommandHandlerPort } from "$lib/modules/common/common";
import type { IGameVectorProjectionWriterPort } from "../../application";
import type {
	ProjectGameVectorsCommand,
	ProjectGameVectorsCommandResult,
} from "./project-game-vectors.command";

export type IProjectGameVectorsCommandHandler = IAsyncCommandHandlerPort<
	ProjectGameVectorsCommand,
	ProjectGameVectorsCommandResult
>;

export type ProjectGameVectorsCommandHandlerDeps = {
	gameVectorProjectionWriter: IGameVectorProjectionWriterPort;
};

export class ProjectGameVectorsCommandHandler implements IProjectGameVectorsCommandHandler {
	constructor(private readonly deps: ProjectGameVectorsCommandHandlerDeps) {}

	executeAsync: IProjectGameVectorsCommandHandler["executeAsync"] = async (command) => {
		const gameClassifications = Array.isArray(command.gameClassifications)
			? command.gameClassifications
			: [command.gameClassifications];
		return await this.deps.gameVectorProjectionWriter.projectAsync({ gameClassifications });
	};
}
