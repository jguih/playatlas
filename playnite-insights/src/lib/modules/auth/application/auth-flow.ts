import type { ILogServicePort } from "$lib/modules/common/application";
import { ValidationError } from "$lib/modules/common/errors";
import type { IAuthFlowPort } from "./auth-flow.port";
import type { IAuthServicePort } from "./auth-service.port";
import type { ISessionIdProviderPort } from "./session-id.provider.port";

export type AuthFlowDeps = {
	authService: IAuthServicePort;
	sessionIdProvider: ISessionIdProviderPort;
	logService: ILogServicePort;
};

export class AuthFlow implements IAuthFlowPort {
	private readonly authService: IAuthServicePort;
	private readonly sessionIdProvider: ISessionIdProviderPort;
	private readonly logService: ILogServicePort;

	constructor({ authService, sessionIdProvider, logService }: AuthFlowDeps) {
		this.authService = authService;
		this.sessionIdProvider = sessionIdProvider;
		this.logService = logService;
	}

	loginAsync: IAuthFlowPort["loginAsync"] = async ({ password }) => {
		if (!password || password.trim() === "")
			return {
				success: false,
				reason_code: "validation_error",
			};

		try {
			const loginResult = await this.authService.loginAsync({ password });

			if (loginResult.success) {
				await this.sessionIdProvider.setAsync(loginResult.sessionId);

				return {
					success: true,
					reason_code: "logged_in",
				};
			}

			switch (loginResult.reason_code) {
				case "instance_not_registered":
					return { success: false, reason_code: "instance_not_registered" };

				case "login_failed":
					return { success: false, reason_code: "invalid_credentials" };

				default:
					return { success: false, reason_code: "unknown_error" };
			}
		} catch (error) {
			if (error instanceof ValidationError) {
				return {
					success: false,
					reason_code: "validation_error",
				};
			}
			if (error instanceof TypeError) {
				this.logService.error("Login request failed due to network error", error);
				return { success: false, reason_code: "network_error" };
			}
			throw error;
		}
	};
}
