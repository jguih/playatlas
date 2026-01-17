import { validation } from "@playatlas/common/application";
import {
	createRelationship,
	type GameImageType,
	type Relationship,
} from "@playatlas/common/common";
import {
	type BaseEntity,
	type CompanyId,
	type GameId,
	type GenreId,
	InvalidStateError,
	type PlatformId,
} from "@playatlas/common/domain";
import type { MakeGameProps, PlayniteGameSnapshot } from "./game.entity.types";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

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
	Readonly<{
		getBackgroundImagePath: () => string | null;
		getCoverImagePath: () => string | null;
		getIconImagePath: () => string | null;
		getDeletedAt: () => Date | null;
		getDeleteAfter: () => Date | null;
		delete: () => void;
		getPlayniteSnapshot: () => PlayniteGameSnapshot;
		setPlayniteSnapshot: (value: PlayniteGameSnapshot) => void;
		getContentHash: () => string;
		setContentHash: (value: string) => void;
		setImageReference: (props: { name: GameImageType; path: { filename: string } }) => void;
		relationships: GameRelationshipProps;
	}>;

export const makeGame = (props: MakeGameProps): Game => {
	const _id = props.id;
	const _created_at = props.createdAt ?? new Date();
	let _contentHash = props.contentHash;
	let _last_updated_at = props.lastUpdatedAt;
	let _deleted_at = props.deletedAt ?? null;
	let _delete_after = props.deleteAfter ?? null;
	let _background_image_path = props.backgroundImagePath ?? null;
	let _cover_image_path = props.coverImagePath ?? null;
	let _icon_image_path = props.iconImagePath ?? null;
	let _playnite_game: PlayniteGameSnapshot = props.playniteSnapshot;

	const _validate = () => {
		if (_playnite_game.playtime < 0)
			throw new InvalidStateError("Playnite playtime must not be negative");
		if (validation.isEmptyString(_contentHash))
			throw new InvalidStateError("ContentHash must not be an empty string");
		if (_deleted_at && !_delete_after)
			throw new InvalidStateError("DeleteAfter must be defined if entity was deleted");
		if (!_deleted_at && _delete_after)
			throw new InvalidStateError("DeletedAt must be defined if entity was deleted");
	};

	const _touch = () => {
		_last_updated_at = new Date();
	};

	_validate();

	const game: Game = {
		getId: () => _id,
		getSafeId: () => _id,
		getBackgroundImagePath: () => _background_image_path,
		getCoverImagePath: () => _cover_image_path,
		getIconImagePath: () => _icon_image_path,
		getDeletedAt: () => _deleted_at,
		getDeleteAfter: () => _delete_after,
		delete: () => {
			_deleted_at = new Date();
			_delete_after = new Date(_deleted_at.getTime() + THIRTY_DAYS);
			_touch();
			_validate();
		},
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
