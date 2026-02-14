import type { ICompletionStatusRepositoryPort } from "../../infra/completion-status.repository.port";
import type {
	GetCompletionStatusesByIdsQuery,
	GetCompletionStatusesByIdsQueryResult,
} from "./get-completion-statuses-by-ids.query";
import type { IGetCompletionStatusesByIdsQueryHandlerPort } from "./get-completion-statuses-by-ids.query-handler.port";

export type GetCompletionStatusesByIdsQueryHandlerDeps = {
	completionStatusRepository: ICompletionStatusRepositoryPort;
};

export class GetCompletionStatusesByIdsQueryHandler implements IGetCompletionStatusesByIdsQueryHandlerPort {
	private readonly completionStatusRepository: ICompletionStatusRepositoryPort;

	constructor({ completionStatusRepository }: GetCompletionStatusesByIdsQueryHandlerDeps) {
		this.completionStatusRepository = completionStatusRepository;
	}

	async executeAsync({
		completionStatusesIds,
	}: GetCompletionStatusesByIdsQuery): Promise<GetCompletionStatusesByIdsQueryResult> {
		const completionStatuses =
			await this.completionStatusRepository.getByIdsAsync(completionStatusesIds);
		return { completionStatuses: completionStatuses.values().toArray() };
	}
}
