import type { IClockPort } from "../application/clock.port";

export class Clock implements IClockPort {
	now: IClockPort["now"] = () => {
		return new Date();
	};
}
