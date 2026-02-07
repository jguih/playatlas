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
	}
}
