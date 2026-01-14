import type { Genre } from "../../domain/genre.entity";

export type SyncGenresCommand = {
	genres: Genre | Genre[];
};
