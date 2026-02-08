export class InvalidStateError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidStateError";
	}
}

export class InvalidArgumentError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidArgumentError";
	}
}

export class InvalidOperationError extends Error {
	constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "InvalidOperationError";
	}
}

export class InvalidFileTypeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidFileTypeError";
	}
}

export class RepositoryError extends Error {
	constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "RepositoryError";
	}
}

export class RepositoryValidationError extends RepositoryError {
	constructor(
		public readonly details: {
			entity: string;
			operation?: "load" | "save" | "query";
			issueCount: number;
			firstIssue?: {
				path: string;
				message: string;
				code?: string;
			};
		},
	) {
		super(`Invalid data for entity "${details.entity}"`);
		this.name = "RepositoryValidationError";
	}
}

export class RepositoryOperationError extends RepositoryError {}

export class DomainError extends Error {
	constructor(message: string, cause?: unknown) {
		super(message, { cause });
		this.name = "DomainError";
	}
}
