import type { IJobFactoryPort } from "../../application/job.factory";
import type { IJobRepositoryPort } from "../../infra/job.repository.port";

export type EnqueueJobCommandResult = void;

export type EnqueueJobCommandHandlerDeps = {
	jobFactory: IJobFactoryPort;
	jobRepository: IJobRepositoryPort;
};
