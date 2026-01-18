import { ISODateSchema } from "@playatlas/common/common";
import { genreIdSchema } from "@playatlas/common/domain";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import type { IGenreMapperPort } from "../application";
import type { IGenreRepositoryPort } from "./genre.repository.port";

export const genreSchema = z.object({
	Id: genreIdSchema,
	Name: z.string(),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type GenreModel = z.infer<typeof genreSchema>;

export type GenreRepositoryDeps = BaseRepositoryDeps & {
	genreMapper: IGenreMapperPort;
};

export const makeGenreRepository = ({
	getDb,
	logService,
	genreMapper,
}: GenreRepositoryDeps): IGenreRepositoryPort => {
	const TABLE_NAME = "playnite_genre";
	const COLUMNS: (keyof GenreModel)[] = [
		"Id",
		"Name",
		"LastUpdatedAt",
		"CreatedAt",
		"DeletedAt",
		"DeleteAfter",
	];
	const base = makeBaseRepository({
		getDb,
		logService,
		config: {
			tableName: TABLE_NAME,
			idColumn: "Id",
			insertColumns: COLUMNS,
			updateColumns: COLUMNS.filter((c) => c !== "Id"),
			mapper: genreMapper,
			modelSchema: genreSchema,
		},
	});

	const add: IGenreRepositoryPort["add"] = (genre) => {
		base._add(genre);
	};

	const upsert: IGenreRepositoryPort["upsert"] = (genre) => {
		base._upsert(genre);
	};

	const update: IGenreRepositoryPort["update"] = (genre) => {
		base._update(genre);
	};

	return {
		...base.public,
		add,
		update,
		upsert,
	};
};
