import {
	makeCryptographyService,
	makeExtensionAuthService,
	makeExtensionRegistrationFactory,
	makeExtensionRegistrationMapper,
	makeInstanceAuthService,
	makeInstanceAuthSettingsFactory,
	makeInstanceAuthSettingsMapper,
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

	const cryptographyService = makeCryptographyService();

	const instanceSessionFactory = makeInstanceSessionFactory({ clock });
	const instanceSessionMapper = makeInstanceSessionMapper({ instanceSessionFactory });
	const instanceSessionRepository = makeInstanceSessionRepository({
		getDb,
		logService: buildLog("InstanceSessionRepository"),
		instanceSessionMapper,
	});

	const instanceAuthSettingsFactory = makeInstanceAuthSettingsFactory({ clock });
	const instanceAuthSettingsMapper = makeInstanceAuthSettingsMapper({
		instanceAuthSettingsFactory,
	});
	const instanceAuthSettingsRepository = makeInstanceAuthSettingsRepository({
		getDb,
		logService: buildLog("InstanceAuthSettingsRepository"),
		instanceAuthSettingsMapper,
	});
	const instanceAuthService = makeInstanceAuthService({
		cryptographyService,
		instanceAuthSettingsRepository,
		instanceSessionRepository,
		logService: buildLog("InstanceAuthService"),
	});

	const extensionRegistrationFactory = makeExtensionRegistrationFactory({ clock });
	const extensionRegistrationMapper = makeExtensionRegistrationMapper({
		extensionRegistrationFactory,
	});
	const extensionRegistrationRepository = makeExtensionRegistrationRepository({
		getDb,
		logService: buildLog("ExtensionRegistrationRepository"),
		extensionRegistrationMapper,
	});
	const extensionAuthService = makeExtensionAuthService({
		logService: buildLog("ExtensionAuthService"),
		extensionRegistrationRepository,
		signatureService,
	});

	const approveExtensionRegistrationCommandHandler = makeApproveExtensionRegistrationHandler({
		logService: buildLog("ApproveExtensionRegistrationCommandHandler"),
		extensionRegistrationRepository,
		eventBus,
	});
	const rejectExtensionRegistrationCommandHandler = makeRejectExtensionRegistrationHandler({
		logService: buildLog("RejectExtensionRegistrationCommandHandler"),
		extensionRegistrationRepository,
		eventBus,
	});
	const revokeExtensionRegistrationCommandHandler = makeRevokeExtensionRegistrationHandler({
		logService: buildLog("RevokeExtensionRegistrationCommandHandler"),
		extensionRegistrationRepository,
		eventBus,
	});
	const removeExtensionRegistrationCommandHandler = makeRemoveExtensionRegistrationHandler({
		logService: buildLog("RemoveExtensionRegistrationCommandHandler"),
		extensionRegistrationRepository,
		eventBus,
	});
	const registerExtensionCommandHandler = makeRegisterExtensionHandler({
		extensionRegistrationRepository,
		logService: buildLog("RegisterExtensionCommandHandler"),
		eventBus,
		extensionRegistrationFactory,
	});

	const getAllExtensionRegistrationsQueryHandler = makeGetAllExtensionRegistrationsQueryHandler({
		extensionRegistrationRepository,
		extensionRegistrationMapper,
	});

	const authApi: IAuthModulePort = {
		getCryptographyService: () => cryptographyService,

		getInstanceSessionFactory: () => instanceSessionFactory,
		getInstanceSessionMapper: () => instanceSessionMapper,
		getInstanceAuthSettingsRepository: () => instanceAuthSettingsRepository,
		getInstanceSessionRepository: () => instanceSessionRepository,

		getInstanceAuthSettingsFactory: () => instanceAuthSettingsFactory,
		getInstanceAuthSettingsMapper: () => instanceAuthSettingsMapper,
		getInstanceAuthService: () => instanceAuthService,

		getExtensionRegistrationFactory: () => extensionRegistrationFactory,
		getExtensionRegistrationMapper: () => extensionRegistrationMapper,
		getExtensionRegistrationRepository: () => extensionRegistrationRepository,
		getExtensionAuthService: () => extensionAuthService,

		commands: {
			getApproveExtensionRegistrationCommandHandler: () =>
				approveExtensionRegistrationCommandHandler,
			getRejectExtensionRegistrationCommandHandler: () => rejectExtensionRegistrationCommandHandler,
			getRevokeExtensionRegistrationCommandHandler: () => revokeExtensionRegistrationCommandHandler,
			getRemoveExtensionRegistrationCommandHandler: () => removeExtensionRegistrationCommandHandler,
			getRegisterExtensionCommandHandler: () => registerExtensionCommandHandler,
		},
		queries: {
			getGetAllExtensionRegistrationsQueryHandler: () => getAllExtensionRegistrationsQueryHandler,
		},
	};
	return Object.freeze(authApi);
};
