import { loginInstanceRequestDtoSchema, type LoginInstanceResponseDto } from "@playatlas/auth/dtos";
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
		return json(
			{
				success: false,
				reason: "Invalid JSON payload",
				reason_code: "invalid_json",
			} satisfies LoginInstanceResponseDto,
			{ status: 400 },
		);
	}

	try {
		const { success, data: requestDto, error } = loginInstanceRequestDtoSchema.safeParse(jsonBody);

		if (!success) {
			api
				.getLogService()
				.warning(`${requestDescription}: Validation error while handling request`, error.issues);
			return json(
				{
					success: false,
					reason: "Validation error",
					reason_code: "validation_error",
					details: error.issues,
				} satisfies LoginInstanceResponseDto,
				{ status: 400 },
			);
		}

		const loginResult = await api.auth
			.getInstanceAuthService()
			.loginAsync({ password: requestDto.password });

		if (!loginResult.success)
			return json(
				{
					success: false,
					reason: loginResult.reason,
					reason_code: loginResult.reason_code,
				} satisfies LoginInstanceResponseDto,
				{ status: 401 },
			);

		return json({
			success: true,
			sessionId: loginResult.sessionId,
		} satisfies LoginInstanceResponseDto);
	} catch (error) {
		api.getLogService().error(`${requestDescription}: Login failed`, error);
		return json(
			{ success: false, reason: "Internal server error" } satisfies LoginInstanceResponseDto,
			{
				status: 500,
			},
		);
	}
};
