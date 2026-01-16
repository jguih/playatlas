import type { ILogServiceFactoryPort, LogLevelNumber } from "@playatlas/common/application";
import { makeLogService } from "./log.service";

export type LogServiceFactoryDeps = {
	getCurrentLogLevel: () => LogLevelNumber;
};

export const makeLogServiceFactory = ({
	getCurrentLogLevel,
}: LogServiceFactoryDeps): ILogServiceFactoryPort => {
	return {
		build: (context) => makeLogService(context, getCurrentLogLevel),
	};
};
