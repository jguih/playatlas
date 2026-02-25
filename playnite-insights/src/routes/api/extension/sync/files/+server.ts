import { extensionAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { apiResponse } from "$lib/server/api/responses";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals: { api } }) =>
	extensionAuthMiddleware({ request, api }, async () => {
		const result = await api.playniteIntegration
			.getPlayniteSyncService()
			.handleMediaFilesSynchronizationRequest(request);
		if (!result.success) {
			return apiResponse.error({
				error: { message: result.reason, details: { code: result.reason_code } },
			});
		}
		return json({ status: "OK" });
	});
