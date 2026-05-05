import { MINUTE_MS } from "../domain/clock.constants";
import type { IClockPort } from "./clock.port";

export const makeClock = (): IClockPort => {
	return {
		now: () => new Date(),
		utcNow: () => Date.now(),
		addMinutes: (date, minutes) => new Date(date.getTime() + minutes * MINUTE_MS),
	};
};
