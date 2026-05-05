import { JobStatus, MINUTE_MS, WorkerIdParser } from "@playatlas/common/domain";
import type { EnqueueJobCommand } from "@playatlas/job-queue/commands";
import { beforeEach, describe, expect, it } from "vitest";
import { api, testApi } from "../vitest.global.setup";

describe("Job Queue", () => {
	beforeEach(() => {
		testApi.getClock().setCurrent(new Date("2026-03-03"));
	});

	it("enqueues and claims job", () => {
		// Arrange
		const command: EnqueueJobCommand = {
			payload: "{}",
			priority: 1,
			type: "game-library-sync",
		};
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());
		const now = testApi.getClock().now();

		// Act
		api.jobQueue.commands.getEnqueueJobCommandHandler().execute(command);
		const { success, job } = api.jobQueue.commands
			.getClaimNextJobCommandHandler()
			.execute({ now, workerId });

		// Assert
		expect(success).toBe(true);
		expect(job).not.toBe(null);
		expect(job?.getStatus()).toBe(JobStatus.processing);
		expect(job?.getAttempts()).toBe(1);
	});

	it("claims next returns null when no job is available", () => {
		// Arrange
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());
		const now = testApi.getClock().now();

		// Act
		const { success, job } = api.jobQueue.commands
			.getClaimNextJobCommandHandler()
			.execute({ now, workerId });

		// Assert
		expect(success).toBe(false);
		expect(job).toBe(null);
	});

	it("doesn't claim job before run at", () => {
		// Arrange
		const command: EnqueueJobCommand = {
			payload: "{}",
			priority: 1,
			type: "game-library-sync",
			runAt: testApi.getClock().now(),
		};
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		api.jobQueue.commands.getEnqueueJobCommandHandler().execute(command);

		testApi.getClock().regress(60 * MINUTE_MS);

		const claim1 = api.jobQueue.commands
			.getClaimNextJobCommandHandler()
			.execute({ now: testApi.getClock().now(), workerId });

		testApi.getClock().advance(60 * MINUTE_MS);

		const claim2 = api.jobQueue.commands
			.getClaimNextJobCommandHandler()
			.execute({ now: testApi.getClock().now(), workerId });

		// Assert
		expect(claim1.success).toBe(false);
		expect(claim1.job).toBe(null);

		expect(claim2.success).toBe(true);
		expect(claim2.job).not.toBe(null);
		expect(claim2.job?.getStatus()).toBe(JobStatus.processing);
	});
});
