import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { apiResponse, type ApiErrorResponse } from "$lib/server/api/responses";
import {
	makeRejectExtensionRegistrationCommand,
	rejectExtensionRegistrationRequestDtoSchema,
} from "@playatlas/auth/commands";
import { type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ params, request, locals: { api } }) =>
	instanceAuthMiddleware({ request, api }, async () => {
		const { registrationId } = params;
		const { success, data, error } = rejectExtensionRegistrationRequestDtoSchema.safeParse({
			registrationId: Number(registrationId),
		});

		if (!success) {
			api
				.getLogService()
				.error(
					`${api.getLogService().getRequestDescription(request)}: Validation error while handling request`,
					error.issues.slice(0, 10),
				);
			return apiResponse.error({
				error: { message: "Validation error", details: error.issues },
			});
		}

		const command = makeRejectExtensionRegistrationCommand(data);

		const result = api.auth.commands
			.getRejectExtensionRegistrationCommandHandler()
			.execute(command);

		if (result.success) return apiResponse.success();

		const response: ApiErrorResponse = { error: { message: result.reason } };
		if (result.reason_code === "not_found") return apiResponse.error(response, { status: 404 });
		else return apiResponse.error(response);
	});
