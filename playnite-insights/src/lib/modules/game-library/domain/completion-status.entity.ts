import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type CompletionStatusId = string & { readonly __brand: "CompletionStatusId" };

export const CompletionStatusIdParser = {
	fromTrusted: (value: string): CompletionStatusId => value as CompletionStatusId,
};

export type CompletionStatus = ClientEntity<CompletionStatusId> &
	Readonly<{
		Name: string | null;
		// Front-end specific
		Sync: EntitySyncStateProps;
	}>;
