import { SessionIdParser } from "../domain";
import type { ISessionIdMapperPort } from "./session-id.mapper.port";

export class SessionIdMapper implements ISessionIdMapperPort {
	constructor() {}

	toDomain: ISessionIdMapperPort["toDomain"] = (model) => {
		return {
			Id: SessionIdParser.fromTrusted(model.SessionId),
			SourceLastUpdatedAt: model.SourceLastUpdatedAt,
		};
	};

	toPersistence: ISessionIdMapperPort["toPersistence"] = (entity) => {
		return {
			SessionId: entity.Id,
			SourceLastUpdatedAt: entity.SourceLastUpdatedAt,
			SourceLastUpdatedAtMs: entity.SourceLastUpdatedAt.getTime(),
		};
	};
}
