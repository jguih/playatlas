import type { SynergyType } from "@playatlas/common/domain";

export type Synergy = {
	type: SynergyType;
	contribution: number;
	details: string;
};
