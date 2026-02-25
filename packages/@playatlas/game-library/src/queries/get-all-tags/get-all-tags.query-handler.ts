import type { IQueryHandlerPort } from "@playatlas/common/application";
import { computeNextSyncCursor } from "@playatlas/common/infra";
import type { TagRepositoryFilters } from "../../infra/tag.repository.types";
import type { GetAllTagsQuery } from "./get-all-tags.query";
import type { GetAllTagsQueryHandlerDeps, GetAllTagsQueryResult } from "./get-all-tags.query.types";

export type IGetAllTagsQueryHandlerPort = IQueryHandlerPort<GetAllTagsQuery, GetAllTagsQueryResult>;

export const makeGetAllTagsQueryHandler = ({
	tagRepository,
	tagMapper,
	logService,
	clock,
}: GetAllTagsQueryHandlerDeps): IGetAllTagsQueryHandlerPort => {
	return {
		execute: ({ lastCursor } = {}) => {
			const filters: TagRepositoryFilters | undefined = lastCursor
				? {
						syncCursor: lastCursor,
					}
				: undefined;

			const tags = tagRepository.all(filters);

			if (lastCursor) {
				const elapsedMs = clock.now().getTime() - lastCursor.lastUpdatedAt.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${tags.length} tags (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${tags.length} tags (no filters)`);
			}

			const tagDtos = tagMapper.toDtoList(tags);
			const nextCursor = computeNextSyncCursor(tags, lastCursor);

			return { data: tagDtos, nextCursor };
		},
	};
};
