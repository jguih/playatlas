import { zodJsonParser, type IHttpClientPort } from "$lib/modules/common/application";
import {
	loginInstanceResponseDtoSchema,
	registerInstanceResponseDtoSchema,
} from "@playatlas/auth/dtos";
import type { IAuthServicePort } from "./auth-service.port";

export type AuthServiceDeps = {
	httpClient: IHttpClientPort;
};

export class AuthService implements IAuthServicePort {
	private readonly httpClient: IHttpClientPort;

	constructor({ httpClient }: AuthServiceDeps) {
		this.httpClient = httpClient;
	}

	loginAsync: IAuthServicePort["loginAsync"] = async ({ password }) => {
		const response = await this.httpClient.postAsync(
			{ endpoint: "/api/auth/login" },
			{ body: JSON.stringify({ password }) },
		);

		return await zodJsonParser(loginInstanceResponseDtoSchema)(response);
	};

	registerAsync: IAuthServicePort["registerAsync"] = async ({ password }) => {
		const response = await this.httpClient.postAsync(
			{ endpoint: "/api/auth/register" },
			{ body: JSON.stringify({ password }) },
		);

		return await zodJsonParser(registerInstanceResponseDtoSchema)(response);
	};
}
