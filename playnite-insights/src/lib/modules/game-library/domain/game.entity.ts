import type { ClientEntity, EntitySyncStateProps } from "$lib/modules/common/common";
import type { CompanyId } from "./company.entity";
import type { CompletionStatusId } from "./completion-status.entity";
import type { GenreId } from "./genre.entity";
import type { PlatformId } from "./platform.entity";

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
		Id: PlayniteGameId;
		Name: string | null;
		Description: string | null;
		ReleaseDate: Date | null;
		Playtime: number;
		LastActivity: Date | null;
		Added: Date | null;
		InstallDirectory: string | null;
		IsInstalled: boolean;
		Hidden: boolean;
		CompletionStatusId: CompletionStatusId | null;
		BackgroundImagePath: string | null;
		CoverImagePath: string | null;
		IconImagePath: string | null;
	} | null;
	CompletionStatusId: CompletionStatusId | null;
	ContentHash: string;
	Developers: CompanyId[];
	Publishers: CompanyId[];
	Genres: GenreId[];
	Platforms: PlatformId[];
	DeletedAt: Date | null;
	DeleteAfter: Date | null;
	// Front-end specific
	Sync: EntitySyncStateProps;
};
