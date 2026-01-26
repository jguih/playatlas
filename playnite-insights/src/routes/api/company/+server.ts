import { instanceAuthMiddleware } from "$lib/server/api/middleware/auth.middleware";
import type { GetCompaniesResponseDto } from "@playatlas/game-library/dtos";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request, url, locals: { api } }) =>
	instanceAuthMiddleware({ request, api }, async () => {
		const sinceLastSync = url.searchParams.get("sinceLastSync");

		if (sinceLastSync && Number.isNaN(Date.parse(sinceLastSync))) {
			return json(
				{
					success: false,
					reason_code: "validation_error",
					reason: "Invalid 'sinceLastSync' param, it must be a valid ISO date string",
				} satisfies GetCompaniesResponseDto,
				{ status: 400 },
			);
		}

		const result = api.gameLibrary.queries
			.getGetAllCompaniesQueryHandler()
			.execute({ since: sinceLastSync ? new Date(sinceLastSync) : null });

		return json({
			success: true,
			companies: result.data,
			reason_code: "companies_fetched_successfully",
			reason: "Companies fetched successfully",
			nextCursor: result.nextCursor,
		} satisfies GetCompaniesResponseDto);
	});
