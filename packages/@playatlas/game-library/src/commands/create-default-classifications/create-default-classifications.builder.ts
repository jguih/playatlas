import type { IClassificationFactoryPort } from "../../application";
import { ClassificationIdParser } from "../../domain";
import type { Classification } from "../../domain/scoring-engine/classification.entity";
import { DEFAULT_CLASSIFICATIONS } from "./create-default-classifications.constants";

export type DefaultClassificationsBuilderDeps = {
	classificationFactory: IClassificationFactoryPort;
};

export const buildDefaultClassifications = ({
	classificationFactory: f,
}: DefaultClassificationsBuilderDeps): Classification[] => {
	return DEFAULT_CLASSIFICATIONS.map((c) =>
		f.create({ ...c, id: ClassificationIdParser.fromTrusted(c.id) }),
	);
};
