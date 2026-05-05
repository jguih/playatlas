export type IClockPort = {
	now: () => Date;
	utcNow: () => number;
	addMinutes: (date: Date, minutes: number) => Date;
};
