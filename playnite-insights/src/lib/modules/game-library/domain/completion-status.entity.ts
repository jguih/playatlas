import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type CompletionStatusId = string;
export type CompletionStatus = ClientEntity<CompletionStatusId> & {
	Name: string | null;
	// Front-end specific
	Sync: EntitySyncStateProps;
};
