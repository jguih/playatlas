import type { IClockPort } from "$lib/modules/common/application";

export type ITestClockPort = IClockPort & {
	advance: (ms: number) => void;
	setCurrent: (value: Date) => void;
};

export class TestClock implements ITestClockPort {
	private current: Date = new Date();

	now = () => this.current;

	advance: ITestClockPort["advance"] = (ms) => {
		this.current = new Date(this.current.getTime() + ms);
	};

	setCurrent: ITestClockPort["setCurrent"] = (value) => (this.current = value);
}
