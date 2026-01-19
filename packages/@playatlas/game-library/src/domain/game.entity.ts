import { validation } from "@playatlas/common/application";
import {
	createRelationship,
	makeSoftDeletable,
	type EntitySoftDeleteProps,
	type GameImageType,
} from "@playatlas/common/common";
import { InvalidStateError, type BaseEntity, type GameId } from "@playatlas/common/domain";
import type {
	GameRelationshipProps,
	MakeGameDeps,
	MakeGameProps,
	PlayniteGameSnapshot,
	RehydrateGameProps,
	UpdateGameFromPlayniteProps,
} from "./game.entity.types";

export type Game = BaseEntity<GameId> &
	EntitySoftDeleteProps &
	Readonly<{
		getBackgroundImagePath: () => string | null;
		getCoverImagePath: () => string | null;
		getIconImagePath: () => string | null;
		getPlayniteSnapshot: () => PlayniteGameSnapshot;
		getContentHash: () => string;
		setImageReference: (props: { name: GameImageType; path: { filename: string } }) => void;
		relationships: GameRelationshipProps;
		updateFromPlaynite: (value: UpdateGameFromPlayniteProps) => boolean;
	}>;

export const makeGame = (props: MakeGameProps, { clock }: MakeGameDeps): Game => {
	const now = clock.now();

	const _id = props.id;
	const _created_at = props.createdAt ?? now;
	let _content_hash = props.contentHash;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	let _background_image_path = props.backgroundImagePath ?? null;
	let _cover_image_path = props.coverImagePath ?? null;
	let _icon_image_path = props.iconImagePath ?? null;
	let _playnite_snapshot: PlayniteGameSnapshot = props.playniteSnapshot;

	const developers = createRelationship(props.developerIds ?? null);
	const genres = createRelationship(props.genreIds ?? null);
	const platforms = createRelationship(props.platformIds ?? null);
	const publishers = createRelationship(props.publisherIds ?? null);

	const _validate = () => {
		if (_playnite_snapshot.playtime < 0)
			throw new InvalidStateError("Playnite playtime must not be negative");
		if (validation.isEmptyString(_content_hash))
			throw new InvalidStateError("ContentHash must not be an empty string");
	};

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{
			deletedAt: props.deletedAt,
			deleteAfter: props.deleteAfter,
		},
		{ clock, touch: _touch, validate: _validate },
	);

	const game: Game = {
		getId: () => _id,
		getSafeId: () => _id,
		getBackgroundImagePath: () => _background_image_path,
		getCoverImagePath: () => _cover_image_path,
		getIconImagePath: () => _icon_image_path,
		...softDelete,
		getPlayniteSnapshot: () => _playnite_snapshot,
		getContentHash: () => _content_hash,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		relationships: {
			developers,
			genres,
			platforms,
			publishers,
		},
		setImageReference: ({ name, path }) => {
			if (validation.isNullOrEmptyString(path.filename))
				throw new InvalidStateError("Filename must not be an empty string or null");

			const filepath = `${_playnite_snapshot.id}/${path.filename}`;
			switch (name) {
				case "background": {
					_background_image_path = filepath;
					break;
				}
				case "cover": {
					_cover_image_path = filepath;
					break;
				}
				case "icon": {
					_icon_image_path = filepath;
					break;
				}
			}
			_touch();
			_validate();
		},
		updateFromPlaynite: (value) => {
			if (_content_hash === value.contentHash) return false;

			_playnite_snapshot = value.playniteSnapshot;
			_content_hash = value.contentHash;

			developers.set(value.relationships.developerIds);
			publishers.set(value.relationships.publisherIds);
			platforms.set(value.relationships.platformIds);
			genres.set(value.relationships.genreIds);

			_touch();
			_validate();
			return true;
		},
		validate: _validate,
	};
	return Object.freeze(game);
};

export const rehydrateGame = (props: RehydrateGameProps, deps: MakeGameDeps) =>
	makeGame(props, deps);
