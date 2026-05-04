import { vi } from "vitest";
import { makeClock } from "../infra";
import type { IClockPort } from "../infra/clock.port";

export type MakeStubClockDeps = {
	now?: Date;
	utcNow?: number;
};

export const makeStubClock = ({ now, utcNow }: MakeStubClockDeps = {}) => {
	const clock = makeClock();

	const stub = {
		...clock,
		now: vi.fn(),
		utcNow: vi.fn(),
		addMinutes: vi.fn(),
	} satisfies IClockPort;

	stub.addMinutes.mockImplementation(clock.addMinutes);

	if (now) {
		stub.now.mockReturnValue(now);
		stub.utcNow.mockReturnValue(utcNow);
	}

	return stub;
};
