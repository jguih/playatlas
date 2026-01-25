import type { CompletionStatusResponseDto } from "@playatlas/game-library/dtos";
import type { CompletionStatus } from "../domain/completion-status.entity";

export type ICompletionStatusMapperPort = {
	toDomain: (dto: CompletionStatusResponseDto, lastSync?: Date | null) => CompletionStatus;
};
