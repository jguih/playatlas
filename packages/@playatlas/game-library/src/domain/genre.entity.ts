import { validation } from "@playatlas/common/application";
import { InvalidStateError, type BaseEntity, type GenreId } from "@playatlas/common/domain";
import type { MakeGenreProps } from "./genre.entity.types";

export type GenreName = string;

export type Genre = BaseEntity<GenreId> &
	Readonly<{
		getName: () => GenreName;
	}>;

export const makeGenre = (props: MakeGenreProps): Genre => {
	const _id: GenreId = props.id;
	const _name: GenreName = props.name;
	const _last_updated_at = props.lastUpdatedAt;
	const _created_at = props.createdAt ?? new Date();

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Genre name must not be empty");
	};

	_validate();

	const genre: Genre = {
		getId: () => _id,
		getSafeId: () => _id,
		getName: () => _name,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		validate: _validate,
	};
	return Object.freeze(genre);
};
