import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { CompletionStatusResponseDto } from "@playatlas/game-library/dtos";
import type { CompletionStatus, CompletionStatusId } from "../domain/completion-status.entity";
import type { CompletionStatusModel } from "../infra/completion-status.repository";

export type ICompletionStatusMapperPort = IClientEntityMapper<
	CompletionStatusId,
	CompletionStatus,
	CompletionStatusModel
> & {
	fromDto: (dto: CompletionStatusResponseDto, lastSync?: Date | null) => CompletionStatus;
};
