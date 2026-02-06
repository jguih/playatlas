import type { ILogServicePort, IQueryHandlerPort } from "@playatlas/common/application";
import { computeNextSyncCursor, type IClockPort } from "@playatlas/common/infra";
import type { IClassificationMapperPort } from "../../application";
import type { IClassificationRepositoryPort } from "../../infra/scoring-engine/classification.repository";
import type { ClassificationRepositoryFilters } from "../../infra/scoring-engine/classification.repository.types";
import type { GetAllClassificationsQuery } from "./get-all-classifications.query";
import type { GetAllClassificationsQueryResult } from "./get-all-classifications.query-handler.types";

export type IGetAllClassificationsQueryHandler = IQueryHandlerPort<
	GetAllClassificationsQuery,
	GetAllClassificationsQueryResult
>;

export type GetAllClassificationsQueryHandlerDeps = {
	classificationRepository: IClassificationRepositoryPort;
	classificationMapper: IClassificationMapperPort;
	logService: ILogServicePort;
	clock: IClockPort;
};

export const makeGetAllClassificationsQueryHandler = ({
	classificationRepository,
	classificationMapper,
	logService,
	clock,
}: GetAllClassificationsQueryHandlerDeps): IGetAllClassificationsQueryHandler => {
	return {
		execute: ({ lastCursor } = {}) => {
			const filters: ClassificationRepositoryFilters | undefined = lastCursor
				? {
						syncCursor: lastCursor,
					}
				: undefined;

			const classifications = classificationRepository.all(filters);

			if (lastCursor) {
				const elapsedMs = clock.now().getTime() - lastCursor.lastUpdatedAt.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${classifications.length} classification(s) (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${classifications.length} classification(s) (no filters)`);
			}

			const classificationsDtos = classificationMapper.toDtoList(classifications);
			const nextCursor = computeNextSyncCursor(classifications, lastCursor);

			return { data: classificationsDtos, nextCursor };
		},
	};
};
