import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import { deserializeSyncCursor, serializeSyncCursor } from "@playatlas/common/infra";
import type { GetCompaniesResponseDto } from "@playatlas/game-library/dtos";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request, url, locals: { api } }) =>
	instanceAuthMiddleware({ request, api }, async () => {
		const sinceLastSync = url.searchParams.get("sinceLastSync");
		const lastCursor = deserializeSyncCursor(sinceLastSync);

		if (sinceLastSync && !lastCursor) {
			return json(
				{
					success: false,
					reason_code: "validation_error",
					reason: "Invalid 'sinceLastSync' param, it must be a valid sync cursor",
				} satisfies GetCompaniesResponseDto,
				{ status: 400 },
			);
		}

		const result = api.gameLibrary.queries.getGetAllCompaniesQueryHandler().execute({ lastCursor });

		return json({
			success: true,
			companies: result.data,
			reason_code: "companies_fetched_successfully",
			reason: "Companies fetched successfully",
			nextCursor: serializeSyncCursor(result.nextCursor),
		} satisfies GetCompaniesResponseDto);
	});
