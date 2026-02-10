import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { deserializeSyncCursor, serializeSyncCursor } from "@playatlas/common/infra";
import type { GetGameSessionsResponseDto } from "@playatlas/game-session/dtos";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request, url, locals: { api } }) =>
	instanceAuthMiddleware({ request, api }, async () => {
		const sinceLastSync = url.searchParams.get("sinceLastSync");
		const lastCursor = deserializeSyncCursor(sinceLastSync);

		if (sinceLastSync && !lastCursor) {
			return json({
				success: false,
				reason_code: "validation_error",
				reason: "Invalid 'sinceLastSync' param, it must be a valid sync cursor",
			} satisfies GetGameSessionsResponseDto);
		}

		const result = api.gameSession.queries
			.getGetAllGameSessionsQueryHandler()
			.execute({ lastCursor });

		return json({
			success: true,
			gameSessions: result.data,
			reason_code: "game_sessions_fetched_successfully",
			reason: "Game sessions fetched successfully",
			nextCursor: serializeSyncCursor(result.nextCursor),
		} satisfies GetGameSessionsResponseDto);
	});
