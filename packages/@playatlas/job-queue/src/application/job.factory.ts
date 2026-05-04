import type { IEntityFactoryPort } from "@playatlas/common/application";
import { JobIdParser } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import { monotonicFactory } from "ulid";
import { makeJob, rehydrateJob, type Job } from "../domain/job.entity";
import type { MakeJobProps, RehydrateJobProps } from "../domain/job.entity.types";

type MakeJobPropsWithOptionalId = Omit<
	MakeJobProps,
	"id" | "status" | "lastError" | "lockedAt" | "workerId" | "attempts" | "maxAttempts"
> & {
	id?: MakeJobProps["id"];
	maxAttempts?: MakeJobProps["maxAttempts"];
};

export type IJobFactoryPort = IEntityFactoryPort<
	MakeJobPropsWithOptionalId,
	RehydrateJobProps,
	Job
>;

export type JobFactoryDeps = {
	clock: IClockPort;
};

export const makeJobFactory = (deps: JobFactoryDeps): IJobFactoryPort => {
	const ulid = monotonicFactory();

	return {
		create: (props) =>
			makeJob(
				{
					...props,
					id: props.id ?? JobIdParser.fromTrusted(ulid()),
					status: "queued",
					lastError: null,
					lockedAt: null,
					workerId: null,
					attempts: 0,
					maxAttempts: props.maxAttempts ?? 3,
				},
				deps,
			),
		rehydrate: (props) => rehydrateJob(props, deps),
	};
};
