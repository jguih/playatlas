import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import {
	makeClassificationAggregate,
	rehydrateClassificationAggregate,
	type Classification,
} from "../../domain/scoring-engine/classification.entity";
import type {
	MakeClassificationProps,
	RehydrateClassificationProps,
} from "../../domain/scoring-engine/classification.entity.types";

export type IClassificationFactoryPort = IEntityFactoryPort<
	MakeClassificationProps,
	RehydrateClassificationProps,
	Classification
>;

export type ClassificationFactoryDeps = {
	clock: IClockPort;
};

export const makeClassificationFactory = (
	deps: ClassificationFactoryDeps,
): IClassificationFactoryPort => {
	return {
		create: (props) => makeClassificationAggregate(props, deps),
		rehydrate: (props) => rehydrateClassificationAggregate(props, deps),
	};
};
