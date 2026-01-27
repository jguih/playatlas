import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { deserializeSyncCursor, serializeSyncCursor } from "@playatlas/common/common";
import type { GetGamesResponseDto } from "@playatlas/game-library/dtos";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request, url, locals: { api } }) =>
	instanceAuthMiddleware({ request, api }, async () => {
		const sinceLastSync = url.searchParams.get("sinceLastSync");
		const lastCursor = deserializeSyncCursor(sinceLastSync);

		if (sinceLastSync && !lastCursor) {
			return json({
				success: false,
				reason_code: "validation_error",
				reason: "Invalid 'sinceLastSync' param, it must be a valid ISO date string",
			} satisfies GetGamesResponseDto);
		}

		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute({ lastCursor });

		return json({
			success: true,
			games: result.data,
			reason_code: "games_fetched_successfully",
			reason: "Games fetched successfully",
			nextCursor: serializeSyncCursor(result.nextCursor),
		} satisfies GetGamesResponseDto);
	});
