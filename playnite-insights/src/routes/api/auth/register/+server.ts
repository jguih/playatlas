import {
	registerInstanceRequestDtoSchema,
	type RegisterInstanceResponseDto,
} from "@playatlas/auth/dtos";
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
			} satisfies RegisterInstanceResponseDto,
			{ status: 400 },
		);
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
			return json(
				{
					success: false,
					reason: "Validation error",
					reason_code: "validation_error",
					details: error.issues,
				} satisfies RegisterInstanceResponseDto,
				{ status: 400 },
			);
		}

		const registerResult = await api.auth
			.getInstanceAuthService()
			.registerAsync({ password: requestDto.password });

		if (!registerResult.success)
			return json(
				{
					success: false,
					reason: registerResult.reason,
					reason_code: registerResult.reason_code,
				} satisfies RegisterInstanceResponseDto,
				{ status: 400 },
			);

		return json({
			success: true,
		} satisfies RegisterInstanceResponseDto);
	} catch (error) {
		api.getLogService().error(`${requestDescription}: Login failed`, error);
		return json(
			{ success: false, reason: "Internal server error" } satisfies RegisterInstanceResponseDto,
			{
				status: 500,
			},
		);
	}
};
