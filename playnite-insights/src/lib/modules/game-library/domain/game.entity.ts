import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type GameId = string;

export type Game = ClientEntity<GameId> & {
	Name: string | null;
	Description: string | null;
	ReleaseDate: Date | null;
	Playtime: number;
	LastActivity: Date | null;
	Added: Date | null;
	InstallDirectory: string | null;
	IsInstalled: boolean;
	BackgroundImagePath: string | null;
	CoverImagePath: string | null;
	IconImagePath: string | null;
	Hidden: boolean;
	CompletionStatusId: string | null;
	ContentHash: string;
	Developers: string[];
	Publishers: string[];
	Genres: string[];
	Platforms: string[];
	DeletedAt: Date | null;
	DeleteAfter: Date | null;
	// Front-end specific
	Sync: EntitySyncStateProps;
};
