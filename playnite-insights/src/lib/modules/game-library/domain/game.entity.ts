export type Game = {
	Id: string;
	Name: string | null;
	Description: string | null;
	ReleaseDate: Date | null;
	Playtime: number;
	LastActivity: Date | null;
	Added: Date | null;
	InstallDirectory: string | null;
	IsInstalled: boolean;
	BackgroundImage: string | null;
	CoverImage: string | null;
	Icon: string | null;
	Hidden: boolean;
	CompletionStatusId: string | null;
	ContentHash: string;
	Developers: string[];
	Publishers: string[];
	Genres: string[];
	Platforms: string[];
	SourceUpdatedAt: Date;
	DeletedAt: Date | null;
	DeleteAfter: Date | null;
	// Front-end specific
	Sync: {
		Status: 'pending' | 'synced' | 'error';
		ErrorMessage: string | null;
		LastSyncedAt: Date | null;
	};
};
