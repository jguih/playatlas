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
				reason_code: "invalid_json",
				reason: "Invalid JSON payload",
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
					reason_code: "validation_error",
					reason: "Validation error",
					details: error.issues,
				} satisfies LoginInstanceResponseDto,
				{ status: 400 },
			);
		}

		const loginResult = await api.auth
			.getInstanceAuthService()
			.loginAsync({ password: requestDto.password });

		if (!loginResult.success) {
			const reasonCode: LoginInstanceResponseDto["reason_code"] =
				loginResult.reason_code === "instance_not_registered"
					? "instance_not_registered"
					: "login_failed";

			return json(
				{
					success: false,
					reason_code: reasonCode,
					reason: "Login failed",
				} satisfies LoginInstanceResponseDto,
				{ status: 401 },
			);
		}

		return json({
			success: true,
			reason_code: "login_successful",
			reason: "Login Successful",
			sessionId: loginResult.sessionId,
		} satisfies LoginInstanceResponseDto);
	} catch (error) {
		api.getLogService().error(`${requestDescription}: Login failed`, error);
		return json(
			{
				success: false,
				reason_code: "unknown_error",
				reason: "Internal server error",
			} satisfies LoginInstanceResponseDto,
			{
				status: 500,
			},
		);
	}
};
