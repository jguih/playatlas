import type { Company } from '../domain/company.entity';
import type { Game } from '../domain/game.entity';
import type { Genre } from '../domain/genre.entity';
import type { Platform } from '../domain/platform.entity';

export type CommonProps = {
	sinceLastSync: Date;
};

export interface IPlayAtlasClientPort {
	getGamesAsync: (props: CommonProps) => Promise<Game[]>;
	getCompaniesAsync: (props: CommonProps) => Promise<Company[]>;
	getPlatformsAsync: (props: CommonProps) => Promise<Platform[]>;
	getGenresAsync: (props: CommonProps) => Promise<Genre[]>;
}
