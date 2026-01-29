import { type EntityMapper } from "@playatlas/common/application";
import { GenreIdParser, PlayniteGenreIdParser } from "@playatlas/common/domain";
import { type Genre } from "../domain";
import type { GenreResponseDto } from "../dtos";
import type { GenreModel } from "../infra/genre.repository";
import type { IGenreFactoryPort } from "./genre.factory";

export type IGenreMapperPort = EntityMapper<Genre, GenreModel, GenreResponseDto>;

export type GenreMapperDeps = {
	genreFactory: IGenreFactoryPort;
};

export const makeGenreMapper = ({ genreFactory }: GenreMapperDeps): IGenreMapperPort => {
	const _toDto: IGenreMapperPort["toDto"] = (entity) => {
		const dto: GenreResponseDto = {
			Id: entity.getId(),
			PlayniteId: entity.getPlayniteSnapshot()?.id ?? null,
			Name: entity.getName(),
			Sync: {
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
			},
		};
		return dto;
	};

	return {
		toPersistence: (entity) => {
			const model: GenreModel = {
				Id: entity.getId(),
				PlayniteId: entity.getPlayniteSnapshot()?.id ?? null,
				Name: entity.getName(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				DeleteAfter: null,
				DeletedAt: null,
			};
			return model;
		},
		toDomain: (model) => {
			const entity: Genre = genreFactory.rehydrate({
				id: GenreIdParser.fromTrusted(model.Id),
				playniteSnapshot: {
					id: model.PlayniteId ? PlayniteGenreIdParser.fromTrusted(model.PlayniteId) : null,
				},
				name: model.Name,
				lastUpdatedAt: new Date(model.LastUpdatedAt),
				createdAt: new Date(model.CreatedAt),
				deletedAt: model.DeletedAt ? new Date(model.DeletedAt) : null,
				deleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : null,
			});
			return entity;
		},
		toDto: _toDto,
		toDtoList: (entities) => {
			return entities.map(_toDto);
		},
	};
};
