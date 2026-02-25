import type { ClassificationId } from "@playatlas/common/domain";

export class ScoreEngineSerializationError extends Error {
	constructor(
		message: string,
		public readonly props: { engineVersion: string; classificationId: ClassificationId },
		cause?: unknown,
	) {
		super(
			`${message} (engine version: ${props.engineVersion}, classification id: ${props.classificationId})`,
			{ cause },
		);
		this.name = "ScoreEngineSerializationError";
	}
}

export class ScoreBreakdownNormalizerError extends Error {
	constructor(message: string, props?: { cause?: unknown }) {
		super(message, { cause: props?.cause });
		this.name = "ScoreBreakdownNormalizerError";
	}
}

export class EvidenceExtractorInvalidDataError extends Error {
	constructor(message: string, props?: { cause?: unknown }) {
		super(message, { cause: props?.cause });
		this.name = "EvidenceExtractorInvalidDataError";
	}
}
