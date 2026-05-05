import type { ICommandHandlerPort } from "@playatlas/common/application";
import type { EnqueueJobCommand } from "./enqueue-job.command";
import type {
	EnqueueJobCommandHandlerDeps,
	EnqueueJobCommandResult,
} from "./enqueue-job.command.types";

export type IEnqueueJobCommandHandler = ICommandHandlerPort<
	EnqueueJobCommand,
	EnqueueJobCommandResult
>;

export const makeEnqueueJobCommandHandler = ({
	jobFactory,
	jobRepository,
}: EnqueueJobCommandHandlerDeps): IEnqueueJobCommandHandler => {
	return {
		execute: (command) => {
			const job = jobFactory.create(command);
			jobRepository.add(job);
		},
	};
};
