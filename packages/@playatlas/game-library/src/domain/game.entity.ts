import { validation } from "@playatlas/common/application";
import {
	createRelationship,
	makeSoftDeletable,
	type EntitySoftDeleteProps,
	type GameImageType,
} from "@playatlas/common/common";
import {
	InvalidStateError,
	type BaseEntity,
	type CompletionStatusId,
	type GameId,
} from "@playatlas/common/domain";
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
		getImagePath: (name: GameImageType) => string | null;
		getPlayniteSnapshot: () => PlayniteGameSnapshot;
		getContentHash: () => string;
		setImageReference: (props: { name: GameImageType; path: { filename: string } }) => void;
		relationships: GameRelationshipProps;
		getCompletionStatusId: () => CompletionStatusId | null;
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
	const _completion_status_id = props.completionStatusId ?? null;

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
		getImagePath: (name) => {
			switch (name) {
				case "background": {
					return _background_image_path;
					break;
				}
				case "cover": {
					return _cover_image_path;
					break;
				}
				case "icon": {
					return _icon_image_path;
					break;
				}
			}
		},
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
		getCompletionStatusId: () => _completion_status_id,
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
			let updated = false;

			if (softDelete.isDeleted()) {
				softDelete.restore();
				updated = true;
			}

			if (_content_hash !== value.contentHash) updated = true;

			if (!updated) return updated;

			_playnite_snapshot = value.playniteSnapshot;
			_content_hash = value.contentHash;

			developers.set(value.relationships.developerIds);
			publishers.set(value.relationships.publisherIds);
			platforms.set(value.relationships.platformIds);
			genres.set(value.relationships.genreIds);

			_touch();
			_validate();
			return updated;
		},
		validate: _validate,
	};
	return Object.freeze(game);
};

export const rehydrateGame = (props: RehydrateGameProps, deps: MakeGameDeps) =>
	makeGame(props, deps);
