import { makeClock, type IClockPort } from "@playatlas/common/infra";
import { vi } from "vitest";

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
