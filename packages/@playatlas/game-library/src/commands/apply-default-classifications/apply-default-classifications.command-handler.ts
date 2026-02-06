import type { ICommandHandlerPort, ILogServicePort } from "@playatlas/common/application";
import type { IClassificationFactoryPort } from "../../application";
import type { Classification } from "../../domain/scoring-engine/classification.entity";
import type { IClassificationRepositoryPort } from "../../infra";
import { buildDefaultClassifications } from "./apply-default-classifications.builder";

export type ApplyDefaultClassificationsCommand =
	| {
			type: "override";
			buildDefaultClassificationsOverride: (deps: {
				classificationFactory: IClassificationFactoryPort;
			}) => Classification[];
	  }
	| { type: "default" };

export type IApplyDefaultClassificationsCommandHandlerPort = ICommandHandlerPort<
	ApplyDefaultClassificationsCommand,
	void
>;

export type ApplyDefaultClassificationsCommandHandlerDeps = {
	classificationRepository: IClassificationRepositoryPort;
	classificationFactory: IClassificationFactoryPort;
	logService: ILogServicePort;
};

export const makeApplyDefaultClassificationsCommandHandler = ({
	classificationRepository,
	classificationFactory,
	logService,
}: ApplyDefaultClassificationsCommandHandlerDeps): IApplyDefaultClassificationsCommandHandlerPort => {
	return {
		execute: (props) => {
			const defaultClassifications =
				props.type === "override"
					? props.buildDefaultClassificationsOverride({ classificationFactory })
					: buildDefaultClassifications({ classificationFactory });

			logService.info(
				`Applying default classifications [${defaultClassifications.length} entry(s)]`,
			);

			for (const classification of defaultClassifications) {
				const existing = classificationRepository.getById(classification.getId());

				if (existing) {
					const didUpdate = existing.update({
						displayName: classification.getDisplayName(),
						description: classification.getDescription(),
						category: classification.getCategory(),
						version: classification.getVersion(),
					});
					if (didUpdate) classificationRepository.update(existing);
					continue;
				}

				classificationRepository.add(classification);
			}

			logService.success(`Default classifications applied successfully`);
		},
	};
};
