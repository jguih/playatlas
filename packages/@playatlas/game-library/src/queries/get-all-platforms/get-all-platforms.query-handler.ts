import { computeNextSyncCursor, type QueryHandler } from "@playatlas/common/common";
import type { PlatformRepositoryFilters } from "../../infra/platform.repository.types";
import type { GetAllPlatformsQuery } from "./get-all-platforms.query";
import type {
	GetAllPlatformsQueryHandlerDeps,
	GetAllPlatformsQueryResult,
} from "./get-all-platforms.query.types";

export type IGetAllPlatformsQueryHandlerPort = QueryHandler<
	GetAllPlatformsQuery,
	GetAllPlatformsQueryResult
>;

export const makeGetAllPlatformQueryHandler = ({
	platformRepository,
	platformMapper,
	logService,
	clock,
}: GetAllPlatformsQueryHandlerDeps): IGetAllPlatformsQueryHandlerPort => {
	return {
		execute: ({ lastCursor } = {}) => {
			const filters: PlatformRepositoryFilters | undefined = lastCursor
				? {
						syncCursor: lastCursor,
					}
				: undefined;

			const platforms = platformRepository.all(filters);

			if (lastCursor) {
				const elapsedMs = clock.now().getTime() - lastCursor.lastUpdatedAt.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${platforms.length} platforms (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${platforms.length} platforms (no filters)`);
			}

			const platformDtos = platformMapper.toDtoList(platforms);
			const nextCursor = computeNextSyncCursor(platforms, lastCursor);

			return { data: platformDtos, nextCursor };
		},
	};
};
