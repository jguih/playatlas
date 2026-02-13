import type { ILogServicePort } from "@playatlas/common/application";
import type { IClockPort, SyncCursor } from "@playatlas/common/infra";
import type { ITagMapperPort } from "../../application";
import type { TagResponseDto } from "../../dtos";
import type { ITagRepositoryPort } from "../../infra";

export type GetAllTagsQueryHandlerDeps = {
	tagRepository: ITagRepositoryPort;
	tagMapper: ITagMapperPort;
	logService: ILogServicePort;
	clock: IClockPort;
};

export type GetAllTagsQueryResult = { data: TagResponseDto[]; nextCursor: SyncCursor };
