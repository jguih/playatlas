import type { QueryHandler } from "@playatlas/common/common";
import { createHashForObject } from "@playatlas/common/infra";
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
		execute: ({ ifNoneMatch, since } = {}) => {
			const filters: CompletionStatusRepositoryFilters | undefined = since
				? {
						lastUpdatedAt: [{ op: "gte", value: since }],
					}
				: undefined;

			const completionStatuses = completionStatusRepository.all(filters);

			const completionStatusesDtos = completionStatusMapper.toDtoList(completionStatuses);
			const nextCursor = computeNextCursor(completionStatusesDtos, since).toISOString();
			const hash = createHashForObject(completionStatusesDtos);
			const etag = `"${hash}"`;

			if (ifNoneMatch === etag) {
				return { type: "not_modified", nextCursor };
			}

			return { type: "ok", data: completionStatusesDtos, etag, nextCursor };
		},
	};
};
