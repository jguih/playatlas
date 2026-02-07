import type { GenreId } from "@playatlas/common/domain";
import type { Game, Genre } from "../../domain";
import type { Evidence } from "./evidence";

export interface IEvidenceExtractorPort<TGroup extends string> {
	extract(
		game: Game,
		options: { readonly genres: ReadonlyMap<GenreId, Genre> },
	): Evidence<TGroup>[];
}
