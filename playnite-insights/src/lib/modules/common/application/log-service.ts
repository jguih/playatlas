import type { ILogServicePort } from "./log-service.port";

export class LogService implements ILogServicePort {
	error = (message: string, error?: unknown) => {
		console.error(`${message}`, error);
	};
	warning = (message: string) => {
		console.warn(message);
	};
	info = (message: string) => {
		console.info(message);
	};
	success = (message: string) => {
		console.info(message);
	};
	debug = (message: string) => {
		console.debug(message);
	};
}
