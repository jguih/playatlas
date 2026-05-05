import type { ICommandHandlerPort } from "@playatlas/common/application";
import type { ClaimNextJobCommand } from "./claim-next-job.command";
import type {
	ClaimNextJobCommandHandlerDeps,
	ClaimNextJobCommandResult,
} from "./claim-next-job.command.types";

export type IClaimNextJobCommandHandler = ICommandHandlerPort<
	ClaimNextJobCommand,
	ClaimNextJobCommandResult
>;

export const makeClaimNextJobCommandHandler = ({
	jobRepository,
}: ClaimNextJobCommandHandlerDeps): IClaimNextJobCommandHandler => {
	return {
		execute: ({ now, workerId }) => {
			const job = jobRepository.claimNext({ workerId, now });
			return job ? { success: true, job } : { success: false, job };
		},
	};
};
