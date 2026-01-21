import { apiResponse } from "$lib/server/api/responses";
import { loginInstanceRequestDtoSchema } from "@playatlas/auth/dtos";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals: { api } }) => {
	const requestDescription = api.getLogService().getRequestDescription(request);
	let jsonBody: unknown;

	try {
		jsonBody = await request.json();
	} catch (error) {
		api
			.getLogService()
			.error(`${requestDescription}: Login failed due to invalid JSON body`, error);
		return apiResponse.error({ error: { message: "Invalid JSON payload" } }, { status: 400 });
	}

	try {
		const { success, data: requestDto, error } = loginInstanceRequestDtoSchema.safeParse(jsonBody);

		if (!success) {
			api
				.getLogService()
				.error(`${requestDescription}: Validation error while handling request`, error.issues);
			return apiResponse.error({
				error: { message: "Validation error", details: error.issues },
			});
		}

		const loginResult = await api.auth
			.getInstanceAuthService()
			.loginAsync({ password: requestDto.password });

		if (!loginResult.success)
			return apiResponse.error({
				error: { message: loginResult.reason, details: { reason_code: loginResult.reason_code } },
			});

		return json({ sessionId: loginResult.sessionId });
	} catch (error) {
		api.getLogService().error(`${requestDescription}: Login failed`, error);
		if (error instanceof Error)
			return apiResponse.error({ error: { message: error.message } }, { status: 500 });
		return apiResponse.error({ error: { message: "Internal server error" } }, { status: 500 });
	}
};
