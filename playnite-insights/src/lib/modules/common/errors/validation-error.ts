export class ValidationError extends Error {
	constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "ValidationError";
	}
}
