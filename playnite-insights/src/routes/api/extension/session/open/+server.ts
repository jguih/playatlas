import { extensionAuthMiddleware } from '$lib/server/api/middleware/auth.middleware';
import { apiResponse } from '$lib/server/api/responses';
import {
	makeOpenGameSessionCommand,
	openGameSessionRequestDtoSchema,
} from '@playatlas/game-session/commands';
import { defaultSSEManager } from '@playnite-insights/infra';
import { emptyResponse } from '@playnite-insights/lib/client';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals: { api } }) =>
	extensionAuthMiddleware({ request, api }, async (result) => {
		if (!result.body) {
			return apiResponse.error({ error: { message: 'Empty body' } }, { status: 400 });
		}

		const { success, data, error } = openGameSessionRequestDtoSchema.safeParse(
			JSON.parse(result.body),
		);

		if (!success) {
			api
				.getLogService()
				.error(
					`${api.getLogService().getRequestDescription(request)}: Validation error while handling request`,
					error.issues.slice(0, 10),
				);
			return apiResponse.error({
				error: { message: 'Validation error', details: error.issues },
			});
		}

		const command = makeOpenGameSessionCommand(data);

		api.gameSession.commands.getOpenGameSessionCommandHandler().execute(command);

		defaultSSEManager.broadcast({ type: 'sessionOpened', data: true });

		return emptyResponse(200);
	});
