import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { apiResponse } from "$lib/server/api/responses";
import type { GetCompletionStatusesResponseDto } from "@playatlas/game-library/dtos";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request, url, locals: { api } }) =>
	instanceAuthMiddleware({ request, api }, async () => {
		const sinceLastSync = url.searchParams.get("sinceLastSync");
		const ifNoneMatch = request.headers.get("if-none-match");

		if (sinceLastSync && Number.isNaN(Date.parse(sinceLastSync))) {
			return json({
				success: false,
				reason_code: "validation_error",
				reason: "Invalid 'sinceLastSync' param, it must be a valid ISO date string",
			} satisfies GetCompletionStatusesResponseDto);
		}

		const result = api.gameLibrary.queries
			.getGetAllCompletionStatusesQueryHandler()
			.execute({ ifNoneMatch, since: sinceLastSync ? new Date(sinceLastSync) : null });

		if (result.type === "not_modified") return apiResponse.notModified();
		else
			return json(
				{
					success: true,
					completionStatuses: result.data,
					reason_code: "completion_statuses_fetched_successfully",
					reason: "CompletionStatuses fetched successfully",
					nextCursor: result.nextCursor,
				} satisfies GetCompletionStatusesResponseDto,
				{ headers: { "Cache-Control": "no-cache", ETag: result.etag } },
			);
	});
