import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request, locals: { api } }) =>
	instanceAuthMiddleware({ request, api }, async () => {
		await api.gameLibrary.getGameAssetsReindexer().reindexGameAssetsAsync();
		return json({ status: "ok" });
	});
