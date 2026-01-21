import type { ILogServicePort } from "@playatlas/common/application";
import { InstanceSessionIdParser, makeInstanceAuthSettings } from "../domain";
import type { IInstanceAuthSettingsRepositoryPort, IInstanceSessionRepositoryPort } from "../infra";
import type { ICryptographyServicePort } from "./cryptography.service.port";
import type { IInstanceAuthServicePort } from "./instance-auth.service.port";

export type InstanceAuthServiceDeps = {
	logService: ILogServicePort;
	cryptographyService: ICryptographyServicePort;
	instanceAuthSettingsRepository: IInstanceAuthSettingsRepositoryPort;
	instanceSessionRepository: IInstanceSessionRepositoryPort;
};

export const makeInstanceAuthService = ({
	logService,
	cryptographyService,
	instanceAuthSettingsRepository,
	instanceSessionRepository,
}: InstanceAuthServiceDeps): IInstanceAuthServicePort => {
	const verify: IInstanceAuthServicePort["verify"] = ({ request }) => {
		const url = new URL(request.url);
		const headers = request.headers;
		const requestDescription = logService.getRequestDescription(request);
		const authorization =
			headers.get("Authorization") ??
			(url.searchParams.get("sessionId") ? `Bearer ${url.searchParams.get("sessionId")}` : null);

		if (!authorization) {
			logService.warning(
				`${requestDescription}: Request rejected due to missing Authorization param`,
			);
			return { authorized: false, reason: "Missing Authorization header" };
		}

		const instanceAuth = instanceAuthSettingsRepository.get();
		if (!instanceAuth) {
			logService.warning(
				`${requestDescription}: Request rejected due to missing instance registration`,
			);
			return { authorized: false, reason: "Instance is not registered" };
		}

		const _sessionId = authorization.split(" ").at(1);

		if (!_sessionId) {
			logService.warning(`${requestDescription}: Request rejected due to missing session id`);
			return {
				authorized: false,
				reason: "Invalid or missing session id",
			};
		}

		const sessionId = InstanceSessionIdParser.fromExternal(_sessionId);

		const existingSession = instanceSessionRepository.getById(sessionId);
		if (!existingSession) {
			logService.warning(`${requestDescription}: Request rejected due to missing session`);
			return {
				authorized: false,
				reason: "Missing instance session",
			};
		}
		if (!cryptographyService.compareSessionIds(existingSession.getId(), sessionId)) {
			logService.warning(`${requestDescription}: Request rejected due to invalid session`);
			return {
				authorized: false,
				reason: "Provided session id is invalid",
			};
		}

		logService.info(`${requestDescription}: Request authorized`);
		return { authorized: true, reason: "Authorized" };
	};

	const registerAsync: IInstanceAuthServicePort["registerAsync"] = async ({ password }) => {
		const existing = instanceAuthSettingsRepository.get();
		if (existing)
			return {
				success: false,
				reason_code: "instance_already_registered",
				reason: "Instance is already registered",
			};

		const { hash, salt } = await cryptographyService.hashPassword(password);

		const instanceAuth = makeInstanceAuthSettings({
			passwordHash: hash,
			salt: salt,
		});

		instanceAuthSettingsRepository.upsert(instanceAuth);

		logService.info(`Created instance registration`);

		return {
			success: true,
			reason_code: "instance_registered",
			reason: "Instance registered",
		};
	};

	const loginAsync: IInstanceAuthServicePort["loginAsync"] = async () => {};

	return { verify, registerAsync, loginAsync };
};
