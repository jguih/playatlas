import { DomainError, type ClassificationId } from "@playatlas/common/domain";
import { ScoreEngineSerializationError } from "../../domain";
import { canonicalScoreBreakdownSchema, LATEST_SCORE_BREAKDOWN_SCHEMA_VERSION } from "../../dtos";
import type { ScoreBreakdownEnvelope } from "./score-breakdown-envelope";
import type { IScoreEnginePort } from "./score-engine.port";
import type { ScoreEngineEvidenceGroupsMeta, ScoreEngineVersion } from "./score-engine.types";

type ScoreEngineDeps<TGroup extends string> = {
	id: ClassificationId;
	version: ScoreEngineVersion;
	evidenceGroupMeta: ScoreEngineEvidenceGroupsMeta<TGroup>;
};

export const makeScoreEngine = <TGroup extends string>({
	id,
	version,
	evidenceGroupMeta,
}: ScoreEngineDeps<TGroup>): IScoreEnginePort<TGroup> => {
	return {
		id,
		version,
		evidenceGroupMeta,
		score: () => {
			throw new DomainError("Not Implemented");
		},
		serializeBreakdown: (breakdown) => {
			const { success, error } = canonicalScoreBreakdownSchema.safeParse(breakdown);

			if (!success)
				throw new ScoreEngineSerializationError(
					"Failed to parse breakdown using latest schema",
					{ classificationId: id, engineVersion: version },
					error,
				);

			const envelope: ScoreBreakdownEnvelope = {
				breakdownSchemaVersion: LATEST_SCORE_BREAKDOWN_SCHEMA_VERSION,
				payload: breakdown,
			};
			return JSON.stringify(envelope);
		},
	};
};
