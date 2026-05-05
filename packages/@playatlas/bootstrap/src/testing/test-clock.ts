import { makeClock, type IClockPort } from "@playatlas/common/infra";

export type TestClock = IClockPort & {
	advance: (ms: number) => void;
	regress: (ms: number) => void;
	setCurrent: (value: Date) => void;
};

export const makeTestClock = (): TestClock => {
	let current = new Date();
	const clock = makeClock();

	return {
		...clock,
		now: () => current,
		utcNow: () => current.getTime(),
		advance: (ms: number) => {
			current = new Date(current.getTime() + ms);
		},
		regress: (ms: number) => {
			current = new Date(current.getTime() - ms);
		},
		setCurrent: (value) => (current = value),
	};
};
