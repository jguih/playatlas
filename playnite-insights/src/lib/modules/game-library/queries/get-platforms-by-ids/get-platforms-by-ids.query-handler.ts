import type { IPlatformRepositoryPort } from "../../infra/platform.repository.port";
import type {
	GetPlatformsByIdsQuery,
	GetPlatformsByIdsQueryResult,
} from "./get-platforms-by-ids.query";
import type { IGetPlatformsByIdsQueryHandlerPort } from "./get-platforms-by-ids.query-handler.port";

export type GetPlatformsByIdsQueryHandlerDeps = {
	platformRepository: IPlatformRepositoryPort;
};

export class GetPlatformsByIdsQueryHandler implements IGetPlatformsByIdsQueryHandlerPort {
	private readonly platformRepository: IPlatformRepositoryPort;

	constructor({ platformRepository }: GetPlatformsByIdsQueryHandlerDeps) {
		this.platformRepository = platformRepository;
	}

	async executeAsync({
		platformIds,
	}: GetPlatformsByIdsQuery): Promise<GetPlatformsByIdsQueryResult> {
		const platforms = await this.platformRepository.getByIdsAsync(platformIds);
		return { platforms };
	}
}
