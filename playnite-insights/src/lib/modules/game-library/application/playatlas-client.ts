import { zodJsonParser, type IHttpClientPort } from "$lib/modules/common/application";
import {
	getCompaniesResponseDtoSchema,
	getCompletionStatusesResponseDtoSchema,
	getGamesResponseDtoSchema,
	getGenresResponseDtoSchema,
	getPlatformsResponseDtoSchema,
} from "@playatlas/game-library/dtos";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";

export type PlayAtlasClientDeps = {
	httpClient: IHttpClientPort;
};

export class PlayAtlasClient implements IPlayAtlasClientPort {
	constructor(private readonly deps: PlayAtlasClientDeps) {}

	getGamesAsync: IPlayAtlasClientPort["getGamesAsync"] = async ({ lastCursor }) => {
		const response = await this.deps.httpClient.getAsync({
			endpoint: `/api/game`,
			searchParams: {
				sinceLastSync: lastCursor,
			},
		});
		return await zodJsonParser(getGamesResponseDtoSchema)(response);
	};

	getCompletionStatusesAsync: IPlayAtlasClientPort["getCompletionStatusesAsync"] = async ({
		lastCursor,
	}) => {
		const response = await this.deps.httpClient.getAsync({
			endpoint: `/api/completion-status`,
			searchParams: {
				sinceLastSync: lastCursor,
			},
		});
		return await zodJsonParser(getCompletionStatusesResponseDtoSchema)(response);
	};

	getCompaniesAsync: IPlayAtlasClientPort["getCompaniesAsync"] = async ({ lastCursor }) => {
		const response = await this.deps.httpClient.getAsync({
			endpoint: `/api/company`,
			searchParams: {
				sinceLastSync: lastCursor,
			},
		});
		return await zodJsonParser(getCompaniesResponseDtoSchema)(response);
	};

	getGenresAsync: IPlayAtlasClientPort["getGenresAsync"] = async ({ lastCursor }) => {
		const response = await this.deps.httpClient.getAsync({
			endpoint: `/api/genre`,
			searchParams: {
				sinceLastSync: lastCursor,
			},
		});
		return await zodJsonParser(getGenresResponseDtoSchema)(response);
	};

	getPlatformsAsync: IPlayAtlasClientPort["getPlatformsAsync"] = async ({ lastCursor }) => {
		const response = await this.deps.httpClient.getAsync({
			endpoint: `/api/platform`,
			searchParams: {
				sinceLastSync: lastCursor,
			},
		});
		return await zodJsonParser(getPlatformsResponseDtoSchema)(response);
	};
}
