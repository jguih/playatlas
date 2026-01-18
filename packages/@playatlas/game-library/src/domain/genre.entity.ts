import { validation } from "@playatlas/common/application";
import { makeSoftDeletable, type EntitySoftDeleteProps } from "@playatlas/common/common";
import { InvalidStateError, type BaseEntity, type GenreId } from "@playatlas/common/domain";
import type { MakeGenreDeps, MakeGenreProps, RehydrateGenreProps } from "./genre.entity.types";

export type GenreName = string;

export type Genre = BaseEntity<GenreId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => GenreName;
		updateFromPlaynite: (value: { name: GenreName }) => boolean;
	}>;

export const makeGenre = (props: MakeGenreProps, { clock }: MakeGenreDeps): Genre => {
	const now = clock.now();

	const _id: GenreId = props.id;
	let _name: GenreName = props.name;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	const _created_at = props.createdAt ?? now;

	const _touch = () => {
		_last_updated_at = new Date();
	};

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Genre name must not be empty");
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{ deletedAt: props.deletedAt, deleteAfter: props.deleteAfter },
		{ clock, touch: _touch, validate: _validate },
	);

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
		...softDelete,
	};
	return Object.freeze(genre);
};

export const rehydrateGenre = (props: RehydrateGenreProps, deps: MakeGenreDeps) =>
	makeGenre(props, deps);
