import type { ILogServicePort } from "@playatlas/common/application";
import { scoreBreakdownEnvelopeSchema } from "../../application/scoring-engine/score-breakdown-envelope";
import type { IScoreBreakdownNormalizerPort } from "../../application/scoring-engine/score-breakdown-normalizer.port";
import { ScoreBreakdownNormalizerError } from "../../domain";
import {
	canonicalScoreBreakdownSchema,
	type ScoreBreakdownSchemaVersion,
} from "../../dtos/scoring-engine/score-breakdown.schema";
import { scoreBreakdownSchemaRegistry } from "./score-breakdown-schema.registry";

export type ScoreBreakdownNormalizerDeps = {
	logService: ILogServicePort;
};

export const makeScoreBreakdownNormalizer = ({
	logService,
}: ScoreBreakdownNormalizerDeps): IScoreBreakdownNormalizerPort => {
	return {
		normalize: (json) => {
			let parsed: unknown;

			try {
				parsed = JSON.parse(json);
			} catch (error) {
				throw new ScoreBreakdownNormalizerError("Failed to parse breakdown JSON", { cause: error });
			}

			const {
				success: envelopeSuccess,
				data: envelope,
				error: envelopeError,
			} = scoreBreakdownEnvelopeSchema.safeParse(parsed);

			if (!envelopeSuccess) {
				throw new ScoreBreakdownNormalizerError("Failed to parse breakdown envelope", {
					cause: envelopeError,
				});
			}

			let entry = scoreBreakdownSchemaRegistry[envelope.breakdownSchemaVersion];

			if (!entry) {
				logService.warning("Unknown breakdown schema version", {
					version: envelope.breakdownSchemaVersion,
				});
				return { type: "raw", payload: envelope.payload };
			}

			const { success: payloadSuccess, data: payloadData } = entry.schema.safeParse(
				envelope.payload,
			);

			if (!payloadSuccess) {
				logService.warning("Breakdown payload validation failed", {
					version: envelope.breakdownSchemaVersion,
				});
				return { type: "raw", payload: envelope.payload };
			}

			let data = payloadData;
			let currentVersion: ScoreBreakdownSchemaVersion | undefined = envelope.breakdownSchemaVersion;

			const visited = new Set();

			while (entry.migrate && entry.next) {
				if (visited.has(entry.next)) {
					throw new ScoreBreakdownNormalizerError("Circular breakdown migration detected");
				}

				const next = scoreBreakdownSchemaRegistry[entry.next];
				if (!next) break;

				logService.debug(`Migrating breakdown`, {
					from: currentVersion,
					to: entry.next,
				});

				data = entry.migrate(data);
				entry = next;
				currentVersion = entry.next;
			}

			const { success, data: latestBreakdown } = canonicalScoreBreakdownSchema.safeParse(data);

			if (!success) {
				logService.error("Canonical breakdown validation failed after migration", {
					version: envelope.breakdownSchemaVersion,
				});
				return { type: "raw", payload: envelope.payload };
			}

			return { type: "normalized", breakdown: latestBreakdown };
		},
	};
};
