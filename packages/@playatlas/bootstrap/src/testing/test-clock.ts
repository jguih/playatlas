import type { IClockPort } from "@playatlas/common/infra";

export type TestClock = IClockPort & {
	advance: (ms: number) => void;
	setCurrent: (value: Date) => void;
};

export const makeTestClock = (): TestClock => {
	let current = new Date();

	return {
		now: () => current,
		advance: (ms: number) => {
			current = new Date(current.getTime() + ms);
		},
		setCurrent: (value) => (current = value),
	};
};
