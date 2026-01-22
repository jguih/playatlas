import { logLevel, type ILogServicePort, type LogLevelNumber } from "@playatlas/common/application";

export const DEFAULT_SOURCE = "PlayAtlasServer";

export const makeLogService = (
	source: string = DEFAULT_SOURCE,
	getCurrentLogLevel: () => LogLevelNumber,
): ILogServicePort => {
	const getDateTimeString = (): string => {
		const now = new Date();
		return now.toLocaleString();
	};

	const logError = (message: string, error?: unknown): void => {
		if (getCurrentLogLevel() > logLevel.error) {
			return;
		}
		if (error) console.error(`[${getDateTimeString()}] [ERROR] [${source}] ${message}`, error);
		else console.error(`[${getDateTimeString()}] [ERROR] [${source}] ${message}`);
	};

	const logWarning = (message: string, details?: unknown): void => {
		if (getCurrentLogLevel() > logLevel.warning) {
			return;
		}
		if (details) console.warn(`[${getDateTimeString()}] [WARNING] [${source}] ${message}`, details);
		else console.warn(`[${getDateTimeString()}] [WARNING] [${source}] ${message}`);
	};

	const logDebug = (message: string): void => {
		if (getCurrentLogLevel() > logLevel.debug) {
			return;
		}
		console.debug(`[${getDateTimeString()}] [DEBUG] [${source}] ${message}`);
	};

	const logSuccess = (message: string): void => {
		if (getCurrentLogLevel() > logLevel.success) {
			return;
		}
		console.log(`[${getDateTimeString()}] [SUCCESS] [${source}] ${message}`);
	};

	const logInfo = (message: string): void => {
		if (getCurrentLogLevel() > logLevel.info) {
			return;
		}
		console.info(`[${getDateTimeString()}] [INFO] [${source}] ${message}`);
	};

	const getRequestDescription: ILogServicePort["getRequestDescription"] = (request) => {
		const url = new URL(request.url);
		return `${request.method} ${url.pathname}`;
	};

	return {
		error: logError,
		warning: logWarning,
		info: logInfo,
		success: logSuccess,
		debug: logDebug,
		getRequestDescription,
	};
};
