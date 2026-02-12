export type GetGamesRankedQuery = {
	limit: number;
	cursor?: number | null;
	filters?: {
		horror?: number;
	};
};
