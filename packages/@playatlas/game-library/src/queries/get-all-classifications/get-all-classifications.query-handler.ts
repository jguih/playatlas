import type { IQueryHandlerPort } from "@playatlas/common/application";
import type { IClassificationRepositoryPort } from "../../infra";
import type { GetAllClassificationsQueryResult } from "./get-all-classifications.query-handler.types";

export type IGetAllClassificationsQueryHandler = IQueryHandlerPort<
	void,
	GetAllClassificationsQueryResult
>;

export type GetAllClassificationsQueryHandlerDeps = {
	classificationRepository: IClassificationRepositoryPort;
};

export const makeGetAllClassificationsQueryHandler = ({
	classificationRepository,
}: GetAllClassificationsQueryHandlerDeps): IGetAllClassificationsQueryHandler => {
	return {
		execute: () => {
			const classifications = classificationRepository.all();
			return { classifications };
		},
	};
};
