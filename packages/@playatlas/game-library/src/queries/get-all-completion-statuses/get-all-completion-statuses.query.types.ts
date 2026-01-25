import type { ICompletionStatusMapperPort } from "../../application/completion-status.mapper";
import type { CompletionStatusResponseDto } from "../../dtos/completion-status.response.dto";
import type { ICompletionStatusRepositoryPort } from "../../infra/completion-status.repository.port";

export type GetAllCompletionStatusesQueryHandlerDeps = {
	completionStatusRepository: ICompletionStatusRepositoryPort;
	completionStatusMapper: ICompletionStatusMapperPort;
};

export type GetAllCompletionStatusesQueryResult =
	| { type: "not_modified"; nextCursor: string }
	| { type: "ok"; data: CompletionStatusResponseDto[]; etag: string; nextCursor: string };
