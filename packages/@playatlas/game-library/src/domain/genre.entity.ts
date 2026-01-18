import { validation } from "@playatlas/common/application";
import { InvalidStateError, type BaseEntity, type GenreId } from "@playatlas/common/domain";
import type { MakeGenreProps } from "./genre.entity.types";

export type GenreName = string;

export type Genre = BaseEntity<GenreId> &
	Readonly<{
		getName: () => GenreName;
		updateFromPlaynite: (value: { name: GenreName }) => boolean;
	}>;

export const makeGenre = (props: MakeGenreProps): Genre => {
	const _id: GenreId = props.id;
	let _name: GenreName = props.name;
	let _last_updated_at = props.lastUpdatedAt;
	const _created_at = props.createdAt ?? new Date();

	const _touch = () => {
		_last_updated_at = new Date();
	};

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
		updateFromPlaynite: ({ name }) => {
			if (name === _name) return false;

			_name = name;
			_touch();
			_validate();
			return true;
		},
		validate: _validate,
	};
	return Object.freeze(genre);
};
