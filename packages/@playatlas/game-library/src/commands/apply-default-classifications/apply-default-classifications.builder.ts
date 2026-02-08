import type { IClassificationFactoryPort } from "../../application";
import type { Classification } from "../../domain/scoring-engine/classification.entity";
import { DEFAULT_CLASSIFICATIONS } from "./apply-default-classifications.constants";

export type DefaultClassificationsBuilderDeps = {
	classificationFactory: IClassificationFactoryPort;
};

export const buildDefaultClassifications = ({
	classificationFactory: f,
}: DefaultClassificationsBuilderDeps): Classification[] => {
	return DEFAULT_CLASSIFICATIONS.map((c) => f.create({ ...c }));
};
