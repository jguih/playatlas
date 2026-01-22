export type ILogServicePort = {
	error: (message: string, error?: unknown) => void;
	warning: (message: string, details?: unknown) => void;
	info: (message: string) => void;
	success: (message: string) => void;
	debug: (message: string) => void;
	getRequestDescription: (request: Request) => string;
};

export type ILogServiceFactoryPort = {
	build: (context?: string) => ILogServicePort;
};
