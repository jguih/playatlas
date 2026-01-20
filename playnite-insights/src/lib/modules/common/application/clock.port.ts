export type IClockPort = {
	now: () => Date;
	lastServerSync: () => Date;
};
