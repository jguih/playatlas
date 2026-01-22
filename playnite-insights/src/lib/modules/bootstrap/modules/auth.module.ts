import { AuthService, type IAuthServicePort } from "$lib/modules/auth/application";
import type { IHttpClientPort } from "$lib/modules/common/application";
import type { IAuthModulePort } from "./auth.module.port";

export type AuthModuleDeps = {
	httpClient: IHttpClientPort;
};

export class AuthModule implements IAuthModulePort {
	readonly authService: IAuthServicePort;

	constructor({ httpClient }: AuthModuleDeps) {
		this.authService = new AuthService({ httpClient });
	}
}
