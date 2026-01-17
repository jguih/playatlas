import type { IClockPort } from "./clock.port";

export const makeClock = (): IClockPort => {
	return {
		now: () => new Date(),
	};
};
