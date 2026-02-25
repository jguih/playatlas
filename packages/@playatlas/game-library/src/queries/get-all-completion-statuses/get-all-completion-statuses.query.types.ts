import type { ILogServicePort } from "@playatlas/common/application";
import type { IClockPort, SyncCursor } from "@playatlas/common/infra";
import type { ICompletionStatusMapperPort } from "../../application/completion-status.mapper";
import type { CompletionStatusResponseDto } from "../../dtos/completion-status.response.dto";
import type { ICompletionStatusRepositoryPort } from "../../infra/completion-status.repository.port";

export type GetAllCompletionStatusesQueryHandlerDeps = {
	completionStatusRepository: ICompletionStatusRepositoryPort;
	completionStatusMapper: ICompletionStatusMapperPort;
	logService: ILogServicePort;
	clock: IClockPort;
};

export type GetAllCompletionStatusesQueryResult = {
	data: CompletionStatusResponseDto[];
	nextCursor: SyncCursor;
};
