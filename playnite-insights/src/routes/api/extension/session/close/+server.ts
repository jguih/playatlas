import { extensionAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { apiResponse } from "$lib/server/api/responses";
import {
	closeGameSessionRequestDtoSchema,
	makeCloseGameSessionCommand,
} from "@playatlas/game-session/commands";
import { defaultSSEManager } from "@playnite-insights/infra";
import { type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals: { api } }) =>
	extensionAuthMiddleware({ request, api }, async (result) => {
		if (!result.body) {
			return apiResponse.error({ error: { message: "Empty body" } }, { status: 400 });
		}

		const { success, data, error } = closeGameSessionRequestDtoSchema.safeParse(
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
				error: { message: "Validation error", details: error.issues },
			});
		}

		const command = makeCloseGameSessionCommand(data);

		const commandResult = api.gameSession.commands
			.getCloseGameSessionCommandHandler()
			.execute(command);

		if (!commandResult.success) {
			return apiResponse.error({
				error: { message: commandResult.reason, details: { code: commandResult.reason_code } },
			});
		}

		defaultSSEManager.broadcast({ type: "sessionClosed", data: true });

		return commandResult.reason_code === "closed_game_session_created"
			? apiResponse.created()
			: apiResponse.ok();
	});
