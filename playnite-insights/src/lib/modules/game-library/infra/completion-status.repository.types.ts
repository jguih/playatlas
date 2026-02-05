import type { ClientRepositoryStoreName } from "$lib/modules/common/infra";

export type CompletionStatusRepositoryIndex = "bySourceLastUpdatedAt";

export type CompletionStatusRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<CompletionStatusRepositoryIndex, CompletionStatusRepositoryIndex>;
};
