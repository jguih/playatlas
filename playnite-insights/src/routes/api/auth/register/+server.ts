import { apiResponse } from "$lib/server/api/responses";
import { registerInstanceRequestDtoSchema } from "@playatlas/auth/dtos";
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
		const {
			success,
			data: requestDto,
			error,
		} = registerInstanceRequestDtoSchema.safeParse(jsonBody);

		if (!success) {
			api
				.getLogService()
				.error(`${requestDescription}: Validation error while handling request`, error.issues);
			return apiResponse.error({
				error: { message: "Validation error", details: error.issues },
			});
		}

		const registerResult = await api.auth
			.getInstanceAuthService()
			.registerAsync({ password: requestDto.password });

		if (!registerResult.success)
			return apiResponse.error({
				error: {
					message: registerResult.reason,
					details: { ...registerResult },
				},
			});

		return json({
			...registerResult,
		});
	} catch (error) {
		api.getLogService().error(`${requestDescription}: Instance registration failed`, error);
		if (error instanceof Error)
			return apiResponse.error({ error: { message: error.message } }, { status: 500 });
		return apiResponse.error({ error: { message: "Internal server error" } }, { status: 500 });
	}
};
