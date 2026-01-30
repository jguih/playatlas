import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";

export type GameId = string & { readonly __brand: "GameId" };

export const GameIdParser = {
	fromTrusted: (value: string) => value as GameId,
};

export type PlayniteGameId = string & { readonly __brand: "PlayniteGameId" };

export const PlayniteGameIdParser = {
	fromTrusted: (value: string) => value as PlayniteGameId,
};

export type Game = ClientEntity<GameId> & {
	Playnite: {
		Id: PlayniteGameId | null;
		Name: string | null;
		Description: string | null;
		ReleaseDate: Date | null;
		Playtime: number;
		LastActivity: Date | null;
		Added: Date | null;
		InstallDirectory: string | null;
		IsInstalled: boolean;
		Hidden: boolean;
		CompletionStatusId: string | null;
	};
	Assets: {
		BackgroundImagePath: string | null;
		CoverImagePath: string | null;
		IconImagePath: string | null;
	};
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
