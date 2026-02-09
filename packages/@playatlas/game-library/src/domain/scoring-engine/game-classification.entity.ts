import { validation } from "@playatlas/common/application";
import {
	InvalidStateError,
	makeSoftDeletable,
	type BaseEntity,
	type ClassificationId,
	type EngineScoreMode,
	type EntitySoftDeleteProps,
	type GameClassificationId,
	type GameId,
} from "@playatlas/common/domain";
import type {
	MakeGameClassificationDeps,
	MakeGameClassificationProps,
	RehydrateGameClassificationProps,
} from "./game-classification.entity.types";

export type GameClassification = BaseEntity<GameClassificationId> &
	EntitySoftDeleteProps &
	Readonly<{
		getGameId: () => GameId;
		getClassificationId: () => ClassificationId;
		getScore: () => number;
		getNormalizedScore: () => number;
		getMode: () => EngineScoreMode;
		getEngineVersion: () => string;
		getBreakdownJson: () => string;
	}>;

export const makeGameClassificationAggregate = (
	props: MakeGameClassificationProps,
	{ clock }: MakeGameClassificationDeps,
) => {
	const now = clock.now();

	const id = props.id;
	const gameId = props.gameId;
	const classificationId = props.classificationId;
	const score = props.score;
	const normalizedScore = props.normalizedScore;
	const mode = props.mode;
	const engineVersion = props.engineVersion;
	const breakdownJson = props.breakdownJson;
	const createdAt = props.createdAt ?? now;
	let lastUpdatedAt = props.lastUpdatedAt ?? now;

	const _touch = () => {
		lastUpdatedAt = clock.now();
	};

	const _validate = () => {
		if (validation.isNullOrEmptyString(engineVersion))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("engineVersion"));
		if (validation.isNullOrEmptyString(breakdownJson))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("breakdownJson"));
		if (score < 0) throw new InvalidStateError("Score must be a positive integer");
		if (normalizedScore < 0)
			throw new InvalidStateError("Normalized score must be a positive real number");
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{
			deletedAt: props.deletedAt,
			deleteAfter: props.deleteAfter,
		},
		{ clock, touch: _touch, validate: _validate },
	);

	const aggregate: GameClassification = {
		getId: () => id,
		getSafeId: () => id,
		getLastUpdatedAt: () => lastUpdatedAt,
		getScore: () => score,
		getNormalizedScore: () => normalizedScore,
		getMode: () => mode,
		getCreatedAt: () => createdAt,
		getGameId: () => gameId,
		getClassificationId: () => classificationId,
		getEngineVersion: () => engineVersion,
		getBreakdownJson: () => breakdownJson,
		...softDelete,
		validate: _validate,
	};
	return Object.freeze(aggregate);
};

export const rehydrateGameClassificationAggregate = (
	props: RehydrateGameClassificationProps,
	deps: MakeGameClassificationDeps,
) => makeGameClassificationAggregate(props, deps);
