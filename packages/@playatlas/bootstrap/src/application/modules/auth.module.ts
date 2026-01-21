import {
	makeCryptographyService,
	makeExtensionAuthService,
	makeInstanceAuthService,
	makeInstanceSessionFactory,
	makeInstanceSessionMapper,
} from "@playatlas/auth/application";
import {
	makeApproveExtensionRegistrationHandler,
	makeRegisterExtensionHandler,
	makeRejectExtensionRegistrationHandler,
	makeRemoveExtensionRegistrationHandler,
	makeRevokeExtensionRegistrationHandler,
} from "@playatlas/auth/commands";
import {
	makeExtensionRegistrationRepository,
	makeInstanceAuthSettingsRepository,
	makeInstanceSessionRepository,
} from "@playatlas/auth/infra";
import { makeGetAllExtensionRegistrationsQueryHandler } from "@playatlas/auth/queries";
import type {
	IDomainEventBusPort,
	ILogServiceFactoryPort,
	ISignatureServicePort,
} from "@playatlas/common/application";
import type { BaseRepositoryDeps, IClockPort } from "@playatlas/common/infra";
import type { IAuthModulePort } from "./auth.module.port";

export type AuthModuleDeps = {
	getDb: BaseRepositoryDeps["getDb"];
	logServiceFactory: ILogServiceFactoryPort;
	signatureService: ISignatureServicePort;
	eventBus: IDomainEventBusPort;
	clock: IClockPort;
};

export const makeAuthModule = ({
	getDb,
	logServiceFactory,
	signatureService,
	eventBus,
	clock,
}: AuthModuleDeps): IAuthModulePort => {
	const buildLog = (ctx: string) => logServiceFactory.build(ctx);

	const instanceSessionFactory = makeInstanceSessionFactory({ clock });
	const instanceSessionMapper = makeInstanceSessionMapper({ instanceSessionFactory });
	const instanceSessionRepository = makeInstanceSessionRepository({
		getDb,
		logService: buildLog("InstanceSessionRepository"),
		instanceSessionMapper,
	});
	const instanceAuthSettingsRepository = makeInstanceAuthSettingsRepository({
		getDb,
		logService: buildLog("InstanceAuthSettingsRepository"),
	});

	const _extension_registration_repo = makeExtensionRegistrationRepository({
		getDb,
		logService: buildLog("ExtensionRegistrationRepository"),
	});
	const _extension_auth_service = makeExtensionAuthService({
		logService: buildLog("ExtensionAuthService"),
		extensionRegistrationRepository: _extension_registration_repo,
		signatureService,
	});
	const _cryptography_service = makeCryptographyService();
	const _instance_auth_service = makeInstanceAuthService({
		cryptographyService: _cryptography_service,
		instanceAuthSettingsRepository: instanceAuthSettingsRepository,
		instanceSessionRepository: instanceSessionRepository,
		logService: buildLog("InstanceAuthService"),
	});
	const _approve_extension_registration_command_handler = makeApproveExtensionRegistrationHandler({
		logService: buildLog("ApproveExtensionRegistrationCommandHandler"),
		extensionRegistrationRepository: _extension_registration_repo,
		eventBus,
	});
	const _reject_extension_registration_command_handler = makeRejectExtensionRegistrationHandler({
		logService: buildLog("RejectExtensionRegistrationCommandHandler"),
		extensionRegistrationRepository: _extension_registration_repo,
		eventBus,
	});
	const _revoke_extension_registration_command_handler = makeRevokeExtensionRegistrationHandler({
		logService: buildLog("RevokeExtensionRegistrationCommandHandler"),
		extensionRegistrationRepository: _extension_registration_repo,
		eventBus,
	});
	const _remove_extension_registration_command_handler = makeRemoveExtensionRegistrationHandler({
		logService: buildLog("RemoveExtensionRegistrationCommandHandler"),
		extensionRegistrationRepository: _extension_registration_repo,
		eventBus,
	});
	const _register_extension_command_handler = makeRegisterExtensionHandler({
		extensionRegistrationRepository: _extension_registration_repo,
		logService: buildLog("RegisterExtensionCommandHandler"),
		eventBus,
	});
	const _get_all_extension_registrations_query_handler =
		makeGetAllExtensionRegistrationsQueryHandler({
			extensionRegistrationRepository: _extension_registration_repo,
		});

	const authApi: IAuthModulePort = {
		getInstanceSessionFactory: () => instanceSessionFactory,
		getInstanceSessionMapper: () => instanceSessionMapper,
		getInstanceAuthSettingsRepository: () => instanceAuthSettingsRepository,
		getInstanceSessionRepository: () => instanceSessionRepository,

		getExtensionRegistrationRepository: () => _extension_registration_repo,
		getExtensionAuthService: () => _extension_auth_service,
		getCryptographyService: () => _cryptography_service,
		getInstanceAuthService: () => _instance_auth_service,
		commands: {
			getApproveExtensionRegistrationCommandHandler: () =>
				_approve_extension_registration_command_handler,
			getRejectExtensionRegistrationCommandHandler: () =>
				_reject_extension_registration_command_handler,
			getRevokeExtensionRegistrationCommandHandler: () =>
				_revoke_extension_registration_command_handler,
			getRemoveExtensionRegistrationCommandHandler: () =>
				_remove_extension_registration_command_handler,
			getRegisterExtensionCommandHandler: () => _register_extension_command_handler,
		},
		queries: {
			getGetAllExtensionRegistrationsQueryHandler: () =>
				_get_all_extension_registrations_query_handler,
		},
	};
	return Object.freeze(authApi);
};
