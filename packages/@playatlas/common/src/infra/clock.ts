import type { IClockPort } from "./clock.port";

export const makeClock = (): IClockPort => {
	const MINUTE_MS = 60 * 1000;
	const FIFTEEN_MINUTES_MS = 15 * MINUTE_MS;

	return {
		now: () => new Date(),
		utcNow: () => Date.now(),
		addMinutes: (date, minutes) => new Date(date.getTime() + minutes * MINUTE_MS),
		FIFTEEN_MINUTES_MS,
		MINUTE_MS,
	};
};
