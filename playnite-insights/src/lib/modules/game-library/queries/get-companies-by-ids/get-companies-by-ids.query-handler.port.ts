import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type {
	GetCompaniesByIdsQuery,
	GetCompaniesByIdsQueryResult,
} from "./get-companies-by-ids.query";

export type IGetCompaniesByIdsQueryHandlerPort = IAsyncQueryHandlerPort<
	GetCompaniesByIdsQuery,
	GetCompaniesByIdsQueryResult
>;
