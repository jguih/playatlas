import { apiResponse } from '$lib/server/api/responses';
import {
	makeRegisterExtensionCommand,
	registerExtensionRequestDtoSchema,
} from '@playatlas/auth/commands';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals: { api } }) => {
	const requestDescription = api.getLogService().getRequestDescription(request);

	try {
		const body = await request.json();
		const { success, data: requestDto, error } = registerExtensionRequestDtoSchema.safeParse(body);

		if (!success) {
			api
				.getLogService()
				.error(
					`${requestDescription}: Validation error while handling request`,
					error.issues.slice(0, 10),
				);
			return apiResponse.error({
				error: { message: 'Validation error', details: error.issues },
			});
		}

		const command = makeRegisterExtensionCommand(requestDto);

		const result = api.auth.commands.getRegisterExtensionCommandHandler().execute(command);

		if (result.success) {
			return json({ registrationId: result.registrationId }, { status: 201 });
		}

		return apiResponse.error({
			error: { message: result.reason, details: { code: result.reason_code } },
		});
	} catch (error) {
		api.getLogService().error(`${requestDescription}: Error thrown while handling request`, error);
		return apiResponse.error({ error: { message: 'Internal server error' } }, { status: 500 });
	}
};
