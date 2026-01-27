import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { deserializeSyncCursor, serializeSyncCursor } from "@playatlas/common/common";
import type { GetCompletionStatusesResponseDto } from "@playatlas/game-library/dtos";
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
			} satisfies GetCompletionStatusesResponseDto);
		}

		const result = api.gameLibrary.queries
			.getGetAllCompletionStatusesQueryHandler()
			.execute({ lastCursor });

		return json({
			success: true,
			completionStatuses: result.data,
			reason_code: "completion_statuses_fetched_successfully",
			reason: "CompletionStatuses fetched successfully",
			nextCursor: serializeSyncCursor(result.nextCursor),
		} satisfies GetCompletionStatusesResponseDto);
	});
