import type {
	IAuthFlowPort,
	IAuthServicePort,
	IExtensionRegistrationClient,
} from "$lib/modules/auth/application";

export interface IAuthModulePort {
	get authService(): IAuthServicePort;

	get authFlow(): IAuthFlowPort;

	get extensionRegistrationClient(): IExtensionRegistrationClient;

	initializeAsync: () => Promise<void>;

	hasSession: () => boolean;
}
