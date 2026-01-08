export type Game = {
	Id: string;
	Name: string | null;
	Description: string | null;
	ReleaseDate: Date | null;
	Playtime: number;
	LastActivity: string | null;
	Added: Date | null;
	InstallDirectory: string | null;
	IsInstalled: number;
	BackgroundImage: string | null;
	CoverImage: string | null;
	Icon: string | null;
	Hidden: number;
	CompletionStatusId: string | null;
	ContentHash: string;
	Developers: string[];
	Publishers: string[];
	Genres: string[];
	Platforms: string[];
	// Front-end specific
	Sync: {
		Status: 'pending' | 'synced' | 'error';
		ErrorMessage: string | null;
	};
	UpdatedAt: Date;
};
