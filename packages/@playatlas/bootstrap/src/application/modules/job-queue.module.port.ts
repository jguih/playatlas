import type { IJobFactoryPort, IJobMapperPort } from "@playatlas/job-queue/application";
import type {
	IClaimNextJobCommandHandler,
	IEnqueueJobCommandHandler,
} from "@playatlas/job-queue/commands";
import type { IJobRepositoryPort } from "@playatlas/job-queue/infra";

export type IJobQueueModulePort = Readonly<{
	getJobFactory: () => IJobFactoryPort;
	getJobMapper: () => IJobMapperPort;
	getJobRepository: () => IJobRepositoryPort;

	commands: {
		getEnqueueJobCommandHandler: () => IEnqueueJobCommandHandler;
		getClaimNextJobCommandHandler: () => IClaimNextJobCommandHandler;
	};
}>;
