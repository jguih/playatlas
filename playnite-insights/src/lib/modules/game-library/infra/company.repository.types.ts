import type { ClientRepositoryStoreName } from "$lib/modules/common/infra";

export type CompanyRepositoryIndex = "bySourceUpdatedAt";

export type CompanyRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<CompanyRepositoryIndex, CompanyRepositoryIndex>;
};
