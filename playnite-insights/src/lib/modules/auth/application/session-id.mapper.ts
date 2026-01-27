import type { ISessionIdMapperPort } from "./session-id.mapper.port";

export class SessionIdMapper implements ISessionIdMapperPort {
	constructor() {}

	toDomain: ISessionIdMapperPort["toDomain"] = (model) => {
		return {
			Id: model.Id,
			SourceUpdatedAt: model.SourceUpdatedAt,
			SourceUpdatedAtMs: model.SourceUpdatedAtMs,
			SessionId: model.SessionId,
		};
	};

	toPersistence: ISessionIdMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			SourceUpdatedAt: entity.SourceUpdatedAt,
			SourceUpdatedAtMs: entity.SourceUpdatedAtMs,
			SessionId: entity.SessionId,
		};
	};
}
