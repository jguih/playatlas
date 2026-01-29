import { validation } from "@playatlas/common/application";
import { makeSoftDeletable, type EntitySoftDeleteProps } from "@playatlas/common/common";
import { InvalidStateError, type BaseEntity, type GenreId } from "@playatlas/common/domain";
import type {
	MakeGenreDeps,
	MakeGenreProps,
	PlayniteGenreSnapshot,
	RehydrateGenreProps,
	UpdateGenreFromPlayniteProps,
} from "./genre.entity.types";

export type GenreName = string;

export type Genre = BaseEntity<GenreId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => GenreName;
		getPlayniteSnapshot: () => PlayniteGenreSnapshot | null;
		updateFromPlaynite: (value: UpdateGenreFromPlayniteProps) => boolean;
	}>;

export const makeGenre = (props: MakeGenreProps, { clock }: MakeGenreDeps): Genre => {
	const now = clock.now();

	const _id: GenreId = props.id;
	let _playnite_snapshot = props.playniteSnapshot ?? null;
	let _name: GenreName = props.name;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	const _created_at = props.createdAt ?? now;

	const _touch = () => {
		_last_updated_at = clock.now();
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
		getPlayniteSnapshot: () => _playnite_snapshot,
		getName: () => _name,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		updateFromPlaynite: ({ name, playniteSnapshot }) => {
			let updated = false;

			if (name !== _name) updated = true;
			if (playniteSnapshot.id !== _playnite_snapshot?.id) updated = true;

			if (!updated) return updated;

			_name = name;
			_playnite_snapshot = playniteSnapshot;

			_touch();
			_validate();
			return updated;
		},
		validate: _validate,
		...softDelete,
	};
	return Object.freeze(genre);
};

export const rehydrateGenre = (props: RehydrateGenreProps, deps: MakeGenreDeps) =>
	makeGenre(props, deps);
