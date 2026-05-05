import type { Job } from "../../domain/job.entity";
import type { IJobRepositoryPort } from "../../infra/job.repository.port";

export type ClaimNextJobCommandResult =
	| {
			success: true;
			job: Job;
	  }
	| {
			success: false;
			job: null;
	  };

export type ClaimNextJobCommandHandlerDeps = {
	jobRepository: IJobRepositoryPort;
};
