import type { IAuthServicePort } from "$lib/modules/auth/application";

export interface IAuthModulePort {
	get authService(): IAuthServicePort;
}
