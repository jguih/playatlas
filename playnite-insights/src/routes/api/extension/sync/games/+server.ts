import { extensionAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { apiResponse } from "$lib/server/api/responses";
import {
	makeSyncGamesCommand,
	syncGamesRequestDtoSchema,
} from "@playatlas/playnite-integration/commands";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals: { api } }) =>
	extensionAuthMiddleware({ request, api }, async (result) => {
		if (!result.body) {
			return json({ error: "Request body cannot be empty" }, { status: 400 });
		}

		let parsed;
		try {
			parsed = JSON.parse(result.body);
		} catch {
			return apiResponse.error({
				error: { message: "Invalid JSON payload" },
			});
		}

		const { success, data, error } = syncGamesRequestDtoSchema.safeParse(parsed);
		if (!success) {
			api
				.getLogService()
				.error(
					`${api.getLogService().getRequestDescription(request)}: Validation error while handling request`,
					error.issues.slice(0, 10),
				);
			return apiResponse.error({
				error: { message: "Validation error", details: error.issues.slice(0, 10) },
			});
		}

		const command = makeSyncGamesCommand(data);
		const commandResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(command);

		if (commandResult.success) {
			return json({ status: "OK" }, { status: 200 });
		}

		return apiResponse.error({
			error: { message: commandResult.reason, details: { reason_code: commandResult.reason_code } },
		});
	});
