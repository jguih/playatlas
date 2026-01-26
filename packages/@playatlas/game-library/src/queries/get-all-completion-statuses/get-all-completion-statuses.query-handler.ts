import type { QueryHandler } from "@playatlas/common/common";
import type { CompletionStatusResponseDto } from "../../dtos/completion-status.response.dto";
import type { CompletionStatusRepositoryFilters } from "../../infra/completion-status.repository.types";
import type { GetAllCompletionStatusesQuery } from "./get-all-completion-statuses.query";
import type {
	GetAllCompletionStatusesQueryHandlerDeps,
	GetAllCompletionStatusesQueryResult,
} from "./get-all-completion-statuses.query.types";

export type IGetAllCompletionStatusesQueryHandlerPort = QueryHandler<
	GetAllCompletionStatusesQuery,
	GetAllCompletionStatusesQueryResult
>;

export const makeGetAllCompletionStatusesQueryHandler = ({
	completionStatusMapper,
	completionStatusRepository,
	logService,
	clock,
}: GetAllCompletionStatusesQueryHandlerDeps): IGetAllCompletionStatusesQueryHandlerPort => {
	const computeNextCursor = (dtos: CompletionStatusResponseDto[], since?: Date | null): Date => {
		const baseCursor = since ?? new Date(0);

		if (dtos.length === 0) {
			return baseCursor;
		}

		return dtos.reduce<Date>((latest, completionStatus) => {
			const updatedAt = new Date(completionStatus.Sync.LastUpdatedAt);
			return updatedAt > latest ? updatedAt : latest;
		}, baseCursor);
	};

	return {
		execute: ({ since } = {}) => {
			const filters: CompletionStatusRepositoryFilters | undefined = since
				? {
						lastUpdatedAt: [{ op: "gte", value: since }],
					}
				: undefined;

			const completionStatuses = completionStatusRepository.all(filters);

			if (since) {
				const elapsedMs = clock.now().getTime() - since.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${completionStatuses.length} completion statuses (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${completionStatuses.length} completion statuses (no filters)`);
			}

			const completionStatusesDtos = completionStatusMapper.toDtoList(completionStatuses);
			const nextCursor = computeNextCursor(completionStatusesDtos, since).toISOString();

			return { data: completionStatusesDtos, nextCursor };
		},
	};
};
