import type { ClientEntity } from '$lib/modules/common/common';

export type GenreId = string;
export type Genre = ClientEntity<GenreId> & {
	Name: string;
};
