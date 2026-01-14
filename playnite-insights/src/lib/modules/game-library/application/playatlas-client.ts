import { type IHttpClientPort, zodJsonParser } from "$lib/modules/common/application";
import {
	companyResponseDtoSchema,
	gameResponseDtoSchema,
	genreResponseDtoSchema,
	platformResponseDtoSchema,
} from "@playatlas/game-library/dtos";
import z from "zod";
import { companyMapper } from "../company.mapper";
import { gameMapper } from "../game.mapper";
import { genreMapper } from "../genre.mapper";
import { platformMapper } from "../platform.mapper";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";

export type PlayAtlasClientDeps = {
	httpClient: IHttpClientPort;
};

export class PlayAtlasClient implements IPlayAtlasClientPort {
	private readonly httpClient: IHttpClientPort;

	constructor({ httpClient }: PlayAtlasClientDeps) {
		this.httpClient = httpClient;
	}

	getGamesAsync: IPlayAtlasClientPort["getGamesAsync"] = async ({ sinceLastSync }) => {
		const response = await this.httpClient.getAsync({
			endpoint: `/api/game`,
			searchParams: {
				sinceLastSync: sinceLastSync.toISOString(),
			},
		});
		const gamesDtos = await zodJsonParser(z.array(gameResponseDtoSchema))(response);
		return gamesDtos.map(gameMapper.toDomain);
	};

	getCompaniesAsync: IPlayAtlasClientPort["getCompaniesAsync"] = async ({ sinceLastSync }) => {
		const response = await this.httpClient.getAsync({
			endpoint: `/api/company`,
			searchParams: {
				sinceLastSync: sinceLastSync.toISOString(),
			},
		});
		const companyDtos = await zodJsonParser(z.array(companyResponseDtoSchema))(response);
		return companyDtos.map(companyMapper.toDomain);
	};

	getGenresAsync: IPlayAtlasClientPort["getGenresAsync"] = async ({ sinceLastSync }) => {
		const response = await this.httpClient.getAsync({
			endpoint: `/api/genre`,
			searchParams: {
				sinceLastSync: sinceLastSync.toISOString(),
			},
		});
		const genreDtos = await zodJsonParser(z.array(genreResponseDtoSchema))(response);
		return genreDtos.map(genreMapper.toDomain);
	};

	getPlatformsAsync: IPlayAtlasClientPort["getPlatformsAsync"] = async ({ sinceLastSync }) => {
		const response = await this.httpClient.getAsync({
			endpoint: `/api/platform`,
			searchParams: {
				sinceLastSync: sinceLastSync.toISOString(),
			},
		});
		const platformDtos = await zodJsonParser(z.array(platformResponseDtoSchema))(response);
		return platformDtos.map(platformMapper.toDomain);
	};
}
