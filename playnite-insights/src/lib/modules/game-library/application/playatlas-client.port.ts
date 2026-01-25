import type {
	GetCompletionStatusesResponseDto,
	GetGamesResponseDto,
} from "@playatlas/game-library/dtos";
import type { Company } from "../domain/company.entity";
import type { Genre } from "../domain/genre.entity";
import type { Platform } from "../domain/platform.entity";

export type CommonProps = {
	sinceLastSync: Date;
};

export interface IPlayAtlasClientPort {
	getGamesAsync: (props: CommonProps) => Promise<GetGamesResponseDto>;
	getCompletionStatusesAsync: (props: CommonProps) => Promise<GetCompletionStatusesResponseDto>;
	getCompaniesAsync: (props: CommonProps) => Promise<Company[]>;
	getPlatformsAsync: (props: CommonProps) => Promise<Platform[]>;
	getGenresAsync: (props: CommonProps) => Promise<Genre[]>;
}
