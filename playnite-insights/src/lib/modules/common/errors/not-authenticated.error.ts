export class NotAuthenticatedError extends Error {
	constructor() {
		super("Instance is not authenticated with PlayAtlas server");
		this.name = "NotAuthenticatedError";
	}
}
