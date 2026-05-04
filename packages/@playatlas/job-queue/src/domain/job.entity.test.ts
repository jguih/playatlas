import { WorkerIdParser } from "@playatlas/common/domain";
import { makeStubClock } from "@playatlas/testing/testing";
import { describe, expect, it } from "vitest";
import { makeJobFactory } from "../application";

describe("Job Aggregate", () => {
	const now = new Date();
	const utcNow = Date.now();
	const clock = makeStubClock({ now: now, utcNow: utcNow });
	const factory = makeJobFactory({ clock });

	it("created a job", () => {
		expect(() =>
			factory.create({
				payload: "{}",
				priority: 1,
				runAt: clock.now(),
				type: "game-library-sync",
			}),
		).not.toThrow(Error);
	});

	it("creates a queued job with default values", () => {
		// Arrange
		const job = factory.create({
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});

		// Assert
		expect(job.getStatus()).toBe("queued");
		expect(job.getAttempts()).toBe(0);
		expect(job.getLockedAt()).toBeNull();
		expect(job.getWorkerId()).toBeNull();
		expect(job.getLastError()).toBeNull();
	});

	it("claims a job when queued and runnable", () => {
		// Arrange
		const job = factory.create({
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		const claimed = job.tryClaim(workerId);

		// Assert
		expect(claimed).toBe(true);
		expect(job.getStatus()).toBe("processing");
		expect(job.getWorkerId()).toBe(workerId);
		expect(job.getLockedAt()).toEqual(now);
		expect(job.getAttempts()).toBe(1);
	});

	it("does not allow claiming an already processing job", () => {
		// Arrange
		const job = factory.create({
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		job.tryClaim(workerId);
		const claimed = job.tryClaim(workerId);

		// Assert
		expect(claimed).toBe(false);
		expect(job.getStatus()).toBe("processing");
	});

	it("does not allow claiming before runAt", () => {
		// Arrange
		const future = clock.addMinutes(clock.now(), 15);
		const job = factory.create({
			payload: "{}",
			priority: 1,
			runAt: future,
			type: "game-library-sync",
		});
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		const claimed = job.tryClaim(workerId);

		// Assert
		expect(claimed).toBe(false);
		expect(job.getStatus()).toBe("queued");
	});

	it("completes a processing job", () => {
		// Arrange
		const job = factory.create({
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		job.tryClaim(workerId);
		job.complete();

		// Assert
		expect(job.getStatus()).toBe("done");
		expect(job.getWorkerId()).toBeNull();
		expect(job.getLockedAt()).toBeNull();
		expect(job.getLastError()).toBeNull();
	});

	it("throws when completing a job not in processing state", () => {
		// Arrange
		const job = factory.create({
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});

		// Act & Assert
		expect(() => job.complete()).toThrow();
	});

	it("requeues job when failing and attempts < maxAttempts", () => {
		// Arrange
		const job = factory.create({
			maxAttempts: 3,
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		job.tryClaim(workerId);
		job.fail("error");

		// Assert
		expect(job.getStatus()).toBe("queued");
		expect(job.getLastError()).toBe("error");
		expect(job.getWorkerId()).toBeNull();
		expect(job.getLockedAt()).toBeNull();
	});

	it("marks job as failed when maxAttempts is reached", () => {
		// Arrange
		const job = factory.create({
			maxAttempts: 1,
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		job.tryClaim(workerId);
		job.fail("error");

		// Assert
		expect(job.getStatus()).toBe("failed");
	});

	it("clears lastError when job is claimed again", () => {
		// Arrange
		const job = factory.create({
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		job.tryClaim(workerId);
		job.fail("error");
		job.tryClaim(workerId);

		// Assert
		expect(job.getLastError()).toBeNull();
	});

	it("increments attempts on each claim", () => {
		// Arrange
		const job = factory.create({
			payload: "{}",
			priority: 1,
			runAt: clock.now(),
			type: "game-library-sync",
		});
		const workerId = WorkerIdParser.fromTrusted(crypto.randomUUID());

		// Act
		job.tryClaim(workerId);
		job.fail("error");
		job.tryClaim(workerId);

		// Assert
		expect(job.getAttempts()).toBe(2);
	});
});
