import type { ClientRepositoryStoreName } from "$lib/modules/common/infra";

export type CompletionStatusRepositoryIndex = "bySourceUpdatedAt";

export type CompletionStatusRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<CompletionStatusRepositoryIndex, CompletionStatusRepositoryIndex>;
};
