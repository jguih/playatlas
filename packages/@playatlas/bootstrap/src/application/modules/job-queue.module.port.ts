import type { IJobFactoryPort, IJobMapperPort } from "@playatlas/job-queue/application";
import type { IJobRepositoryPort } from "@playatlas/job-queue/infra";

export type IJobQueueModulePort = Readonly<{
	getJobFactory: () => IJobFactoryPort;
	getJobMapper: () => IJobMapperPort;
	getJobRepository: () => IJobRepositoryPort;
}>;
