import { type EntityMapper } from "@playatlas/common/application";
import { GenreIdParser } from "@playatlas/common/domain";
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
			Name: entity.getName(),
		};
		return dto;
	};

	return {
		toPersistence: (entity) => {
			const model: GenreModel = {
				Id: entity.getId(),
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
				name: model.Name,
				lastUpdatedAt: new Date(model.LastUpdatedAt),
				createdAt: new Date(model.CreatedAt),
				deletedAt: model.DeletedAt ? new Date(model.DeletedAt) : undefined,
				deleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : undefined,
			});
			return entity;
		},
		toDto: _toDto,
		toDtoList: (entities) => {
			const dtos: GenreResponseDto[] = [];
			for (const entity of entities) dtos.push(_toDto(entity));
			return dtos;
		},
	};
};
