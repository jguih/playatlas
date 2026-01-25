import type { QueryHandler } from "@playatlas/common/common";
import { createHashForObject } from "@playatlas/common/infra";
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
	return {
		execute: ({ ifNoneMatch, since } = {}) => {
			const filters: CompletionStatusRepositoryFilters | undefined = since
				? {
						lastUpdatedAt: [{ op: "gte", value: since }],
					}
				: undefined;

			const completionStatuses = completionStatusRepository.all(filters);

			if (!completionStatuses || completionStatuses.length === 0) {
				return { type: "ok", data: [], etag: '"empty"' };
			}

			const completionStatusesDtos = completionStatusMapper.toDtoList(completionStatuses);
			const hash = createHashForObject(completionStatusesDtos);
			const etag = `"${hash}"`;

			if (ifNoneMatch === etag) {
				return { type: "not_modified" };
			}

			return { type: "ok", data: completionStatusesDtos, etag };
		},
	};
};
