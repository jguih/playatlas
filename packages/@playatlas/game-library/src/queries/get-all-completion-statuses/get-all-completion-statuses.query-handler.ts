import type { IQueryHandlerPort } from "@playatlas/common/application";
import { computeNextSyncCursor } from "@playatlas/common/common";
import type { CompletionStatusRepositoryFilters } from "../../infra/completion-status.repository.types";
import type { GetAllCompletionStatusesQuery } from "./get-all-completion-statuses.query";
import type {
	GetAllCompletionStatusesQueryHandlerDeps,
	GetAllCompletionStatusesQueryResult,
} from "./get-all-completion-statuses.query.types";

export type IGetAllCompletionStatusesQueryHandlerPort = IQueryHandlerPort<
	GetAllCompletionStatusesQuery,
	GetAllCompletionStatusesQueryResult
>;

export const makeGetAllCompletionStatusesQueryHandler = ({
	completionStatusMapper,
	completionStatusRepository,
	logService,
	clock,
}: GetAllCompletionStatusesQueryHandlerDeps): IGetAllCompletionStatusesQueryHandlerPort => {
	return {
		execute: ({ lastCursor } = {}) => {
			const filters: CompletionStatusRepositoryFilters | undefined = lastCursor
				? {
						syncCursor: lastCursor,
					}
				: undefined;

			const completionStatuses = completionStatusRepository.all(filters);

			if (lastCursor) {
				const elapsedMs = clock.now().getTime() - lastCursor.lastUpdatedAt.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${completionStatuses.length} completion statuses (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${completionStatuses.length} completion statuses (no filters)`);
			}

			const completionStatusesDtos = completionStatusMapper.toDtoList(completionStatuses);
			const nextCursor = computeNextSyncCursor(completionStatuses, lastCursor);

			return { data: completionStatusesDtos, nextCursor };
		},
	};
};
