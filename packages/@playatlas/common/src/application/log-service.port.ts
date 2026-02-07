export type ILogServicePort = {
	error: (message: string, error?: unknown) => void;
	warning: (message: string, details?: unknown) => void;
	info: (message: string, details?: object) => void;
	success: (message: string, details?: object) => void;
	debug: (message: string, details?: object) => void;
	getRequestDescription: (request: Request) => string;
};

export type ILogServiceFactoryPort = {
	build: (context?: string) => ILogServicePort;
};
