import type { JobId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Job } from "../domain/job.entity";

export type IJobRepositoryPort = IEntityRepositoryPort<JobId, Job>;
