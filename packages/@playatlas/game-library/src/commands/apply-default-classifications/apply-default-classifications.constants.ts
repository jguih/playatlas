import type { MakeClassificationProps } from "../../domain/scoring-engine/classification.entity.types";
import { classificationIds } from "../../domain/value-object/classification-id";

export const DEFAULT_CLASSIFICATION_VERSION =
	"v1.0.0" as const satisfies MakeClassificationProps["version"];

export type MakeClassificationPropsWithoutBrandedId = Omit<MakeClassificationProps, "id"> & {
	id: (typeof classificationIds)[number];
};

export const DEFAULT_CLASSIFICATIONS = [
	{
		id: "RPG",
		category: "genre",
		description: "Horror games",
		displayName: "Horror",
		version: DEFAULT_CLASSIFICATION_VERSION,
	},
	{
		id: "HORROR",
		category: "genre",
		description: "Horror games",
		displayName: "Horror",
		version: DEFAULT_CLASSIFICATION_VERSION,
	},
	{
		id: "SURVIVAL",
		category: "genre",
		description: "Simulation games",
		displayName: "Simulation",
		version: DEFAULT_CLASSIFICATION_VERSION,
	},
] as const satisfies MakeClassificationPropsWithoutBrandedId[];
