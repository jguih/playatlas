import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { deserializeSyncCursor, serializeSyncCursor } from "@playatlas/common/infra";
import type { GetGameClassificationsResponseDto } from "@playatlas/game-library/dtos";
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
			} satisfies GetGameClassificationsResponseDto);
		}

		const result = api.gameLibrary.scoreEngine.queries
			.getGetAllGameClassificationsQueryHandler()
			.execute({ lastCursor });

		return json({
			success: true,
			gameClassifications: result.data,
			reason_code: "game_classifications_fetched_successfully",
			reason: "Games classifications fetched successfully",
			nextCursor: serializeSyncCursor(result.nextCursor),
		} satisfies GetGameClassificationsResponseDto);
	});
