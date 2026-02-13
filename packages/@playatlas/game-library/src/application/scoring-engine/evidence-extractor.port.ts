import type { GenreId, TagId } from "@playatlas/common/domain";
import type { Game, Genre, Tag } from "../../domain";
import type { Evidence } from "./evidence.types";

export interface IEvidenceExtractorPort<TGroup extends string> {
	extract(
		game: Game,
		options: {
			readonly genres: ReadonlyMap<GenreId, Genre>;
			readonly tags: ReadonlyMap<TagId, Tag>;
		},
	): Evidence<TGroup>[];
}
