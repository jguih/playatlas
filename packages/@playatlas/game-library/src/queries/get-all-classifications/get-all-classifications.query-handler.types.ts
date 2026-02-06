import type { Classification } from "../../domain/scoring-engine/classification.entity";

export type GetAllClassificationsQueryResult = {
	classifications: Classification[];
};
