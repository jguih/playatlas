import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params, request, locals: { services } }) => {
	const parts = params.params?.split("/") ?? [];

	let playniteGameId: string;
	let imageId: string;

	if (parts.length === 2) {
		// old format: /image/:gameId/:imageId
		[playniteGameId, imageId] = parts;
	} else if (parts.length === 3) {
		// new format: /image/:type/:gameId/:imageId
		[, playniteGameId, imageId] = parts;
	} else {
		return new Response(undefined, { status: 404 });
	}
	const ifNoneMatch = request.headers.get("if-none-match");
	const ifModifiedSince = request.headers.get("if-modified-since");
	if (!playniteGameId || !imageId) {
		return json({ error: "Missing playniteGameId or playniteImageId" }, { status: 400 });
	}
	const result = await services.mediaFilesService.getGameImage(
		playniteGameId,
		imageId,
		ifNoneMatch,
		ifModifiedSince,
	);
	return result;
};
