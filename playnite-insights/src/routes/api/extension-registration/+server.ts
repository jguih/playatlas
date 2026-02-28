import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, locals: { api } }) =>
	instanceAuthMiddleware({ request, api }, async () => {
		const result = api.auth.queries.getGetAllExtensionRegistrationsQueryHandler().execute();
		return json({ registrations: result.type === "ok" ? result.data : [] });
	});
