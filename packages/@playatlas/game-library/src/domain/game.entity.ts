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
import type { MakeGameProps } from "./game.entity.types";

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
		getName: () => string | null;
		getDescription: () => string | null;
		getReleaseDate: () => Date | null;
		getPlaytime: () => number;
		getLastActivity: () => Date | null;
		getAdded: () => Date | null;
		getInstallDirectory: () => string | null;
		isInstalled: () => boolean;
		isHidden: () => boolean;
		getBackgroundImage: () => string | null;
		getCoverImage: () => string | null;
		getIcon: () => string | null;
		getCompletionStatusId: () => string | null;
		getContentHash: () => string;
		setImageReference: (props: { name: GameImageType; path: { filename: string } }) => void;
		relationships: GameRelationshipProps;
	}>;

export const makeGame = (props: MakeGameProps): Game => {
	const _id = props.id;
	const _name = props.name ?? null;
	const _description = props.description ?? null;
	const _releaseDate = props.releaseDate ?? null;
	const _playtime = props.playtime ?? 0;
	const _lastActivity = props.lastActivity ?? null;
	const _added = props.added ?? null;
	const _installDirectory = props.installDirectory ?? null;
	const _isInstalled = Boolean(props.isInstalled);
	let _backgroundImage = props.backgroundImage ?? null;
	let _coverImage = props.coverImage ?? null;
	let _icon = props.icon ?? null;
	const _hidden = Boolean(props.hidden);
	const _completionStatusId = props.completionStatusId ?? null;
	const _contentHash = props.contentHash;
	let _last_updated_at = props.lastUpdatedAt;

	const _validate = () => {
		if (_playtime < 0) throw new InvalidStateError("Playtime must not be negative");
		if (validation.isEmptyString(_contentHash))
			throw new InvalidStateError("ContentHash must not be an empty string");
	};

	const _touch = () => {
		_last_updated_at = new Date();
	};

	_validate();

	const game: Game = {
		getId: () => _id,
		getSafeId: () => _id,
		getName: () => _name,
		getDescription: () => _description,
		getReleaseDate: () => _releaseDate,
		getPlaytime: () => _playtime,
		getLastActivity: () => _lastActivity,
		getAdded: () => _added,
		getInstallDirectory: () => _installDirectory,
		isInstalled: () => _isInstalled,
		isHidden: () => _hidden,
		getBackgroundImage: () => _backgroundImage,
		getCoverImage: () => _coverImage,
		getIcon: () => _icon,
		getCompletionStatusId: () => _completionStatusId,
		getContentHash: () => _contentHash,
		getLastUpdatedAt: () => _last_updated_at,
		relationships: {
			developers: createRelationship(props.developerIds ?? null),
			genres: createRelationship(props.genreIds ?? null),
			platforms: createRelationship(props.platformIds ?? null),
			publishers: createRelationship(props.publisherIds ?? null),
		},
		setImageReference: ({ name, path }) => {
			if (validation.isNullOrEmptyString(path.filename))
				throw new InvalidStateError("Filename must not be an empty string or null");

			const filepath = `${_id}\\${path.filename}`;
			switch (name) {
				case "background": {
					_backgroundImage = filepath;
					break;
				}
				case "cover": {
					_coverImage = filepath;
					break;
				}
				case "icon": {
					_icon = filepath;
					break;
				}
			}
			_touch();
		},
		validate: _validate,
	};
	return Object.freeze(game);
};
