import { zodJsonParser, type IHttpClientPort } from "$lib/modules/common/application";
import {
	getCompaniesResponseDtoSchema,
	getCompletionStatusesResponseDtoSchema,
	getGamesResponseDtoSchema,
} from "@playatlas/game-library/dtos";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";

export type PlayAtlasClientDeps = {
	httpClient: IHttpClientPort;
};

export class PlayAtlasClient implements IPlayAtlasClientPort {
	private readonly httpClient: IHttpClientPort;

	constructor({ httpClient }: PlayAtlasClientDeps) {
		this.httpClient = httpClient;
	}

	getGamesAsync: IPlayAtlasClientPort["getGamesAsync"] = async ({ lastCursor }) => {
		const response = await this.httpClient.getAsync({
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
		const response = await this.httpClient.getAsync({
			endpoint: `/api/completion-status`,
			searchParams: {
				sinceLastSync: lastCursor,
			},
		});
		return await zodJsonParser(getCompletionStatusesResponseDtoSchema)(response);
	};

	getCompaniesAsync: IPlayAtlasClientPort["getCompaniesAsync"] = async ({ lastCursor }) => {
		const response = await this.httpClient.getAsync({
			endpoint: `/api/company`,
			searchParams: {
				sinceLastSync: lastCursor,
			},
		});
		return await zodJsonParser(getCompaniesResponseDtoSchema)(response);
	};

	getGenresAsync: IPlayAtlasClientPort["getGenresAsync"] = async () => {
		throw new Error("Not Implemented");
	};

	getPlatformsAsync: IPlayAtlasClientPort["getPlatformsAsync"] = async () => {
		throw new Error("Not Implemented");
	};
}
