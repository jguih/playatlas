import type { IClockPort } from "./clock.port";

export const makeClock = (): IClockPort => {
	const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

	return {
		now: () => new Date(),
		utcNow: () => Date.now(),
		addMinutes: (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000),
		FIFTEEN_MINUTES_MS,
	};
};
