import type {
	GetCompaniesResponseDto,
	GetCompletionStatusesResponseDto,
	GetGameClassificationsResponseDto,
	GetGamesResponseDto,
	GetGenresResponseDto,
	GetPlatformResponseDto,
} from "@playatlas/game-library/dtos";

export type CommonProps = {
	lastCursor: string | null;
};

export interface IPlayAtlasClientPort {
	getGamesAsync: (props: CommonProps) => Promise<GetGamesResponseDto>;
	getCompletionStatusesAsync: (props: CommonProps) => Promise<GetCompletionStatusesResponseDto>;
	getCompaniesAsync: (props: CommonProps) => Promise<GetCompaniesResponseDto>;
	getPlatformsAsync: (props: CommonProps) => Promise<GetPlatformResponseDto>;
	getGenresAsync: (props: CommonProps) => Promise<GetGenresResponseDto>;
	getGameClassificationsAsync: (props: CommonProps) => Promise<GetGameClassificationsResponseDto>;
}
