import type { IClockPort, ILogServicePort } from "$lib/modules/common/application";
import type { IDomainEventBusPort } from "$lib/modules/common/application/event-bus.port";
import { ValidationError } from "$lib/modules/common/errors";
import { SessionIdParser } from "../domain";
import type { IAuthFlowPort } from "./auth-flow.port";
import type { IAuthServicePort } from "./auth-service.port";
import type { ISessionIdProviderPort } from "./session-id.provider.port";

export type AuthFlowDeps = {
	authService: IAuthServicePort;
	sessionIdProvider: ISessionIdProviderPort;
	logService: ILogServicePort;
	eventBus: IDomainEventBusPort;
	clock: IClockPort;
};

export class AuthFlow implements IAuthFlowPort {
	constructor(private readonly deps: AuthFlowDeps) {}

	loginAsync: IAuthFlowPort["loginAsync"] = async ({ password }) => {
		const { authService, eventBus, logService, sessionIdProvider, clock } = this.deps;

		if (!password || password.trim() === "")
			return {
				success: false,
				reason_code: "validation_error",
			};

		try {
			const loginResult = await authService.loginAsync({ password });

			if (loginResult.success) {
				await sessionIdProvider.setAsync(SessionIdParser.fromTrusted(loginResult.sessionId));

				eventBus.emit({
					id: crypto.randomUUID(),
					name: "login-successful",
					occurredAt: clock.now(),
				});
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
				logService.error("Login request failed due to network error", error);
				return { success: false, reason_code: "network_error" };
			}
			throw error;
		}
	};
}
