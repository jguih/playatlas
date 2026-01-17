import { validation } from "@playatlas/common/application";
import {
	createRelationship,
	makeSoftDeletable,
	type EntitySoftDeleteProps,
	type GameImageType,
	type Relationship,
} from "@playatlas/common/common";
import {
	InvalidStateError,
	type BaseEntity,
	type CompanyId,
	type GameId,
	type GenreId,
	type PlatformId,
} from "@playatlas/common/domain";
import type {
	MakeGameDeps,
	MakeGameProps,
	PlayniteGameSnapshot,
	RehydrateGameProps,
} from "./game.entity.types";

export type GameRelationshipMap = {
	developers: CompanyId;
	publishers: CompanyId;
	genres: GenreId;
	platforms: PlatformId;
};

export type GameRelationship = keyof GameRelationshipMap;

export type GameRelationshipProps = {
	[K in GameRelationship]: Relationship<GameRelationshipMap[K]>;
};

export type Game = BaseEntity<GameId> &
	EntitySoftDeleteProps &
	Readonly<{
		getBackgroundImagePath: () => string | null;
		getCoverImagePath: () => string | null;
		getIconImagePath: () => string | null;
		getPlayniteSnapshot: () => PlayniteGameSnapshot;
		setPlayniteSnapshot: (value: PlayniteGameSnapshot) => void;
		getContentHash: () => string;
		setContentHash: (value: string) => void;
		setImageReference: (props: { name: GameImageType; path: { filename: string } }) => void;
		relationships: GameRelationshipProps;
	}>;

export const makeGame = (props: MakeGameProps, { clock }: MakeGameDeps): Game => {
	const now = clock.now();

	const _id = props.id;
	const _created_at = props.createdAt ?? now;
	let _contentHash = props.contentHash;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	let _background_image_path = props.backgroundImagePath ?? null;
	let _cover_image_path = props.coverImagePath ?? null;
	let _icon_image_path = props.iconImagePath ?? null;
	let _playnite_game: PlayniteGameSnapshot = props.playniteSnapshot;

	const _validate = () => {
		if (_playnite_game.playtime < 0)
			throw new InvalidStateError("Playnite playtime must not be negative");
		if (validation.isEmptyString(_contentHash))
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
		getPlayniteSnapshot: () => _playnite_game,
		setPlayniteSnapshot: (value) => {
			_playnite_game = value;
			_touch();
			_validate();
		},
		getContentHash: () => _contentHash,
		setContentHash: (value) => {
			_contentHash = value;
			_touch();
			_validate();
		},
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		relationships: {
			developers: createRelationship(props.developerIds ?? null),
			genres: createRelationship(props.genreIds ?? null),
			platforms: createRelationship(props.platformIds ?? null),
			publishers: createRelationship(props.publisherIds ?? null),
		},
		setImageReference: ({ name, path }) => {
			if (validation.isNullOrEmptyString(path.filename))
				throw new InvalidStateError("Filename must not be an empty string or null");

			const filepath = `${_playnite_game.id}/${path.filename}`;
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
		validate: _validate,
	};
	return Object.freeze(game);
};

export const rehydrateGame = (props: RehydrateGameProps, deps: MakeGameDeps) =>
	makeGame(props, deps);
