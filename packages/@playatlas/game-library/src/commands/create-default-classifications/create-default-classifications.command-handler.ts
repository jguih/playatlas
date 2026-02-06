import type { ICommandHandlerPort } from "@playatlas/common/application";
import type { IClassificationFactoryPort } from "../../application";
import type { IClassificationRepositoryPort } from "../../infra";
import { buildDefaultClassifications } from "./create-default-classifications.builder";

export type ICreateDefaultClassificationsCommandHandlerPort = ICommandHandlerPort<void, void>;

export type CreateDefaultClassificationsCommandHandlerDeps = {
	classificationRepository: IClassificationRepositoryPort;
	classificationFactory: IClassificationFactoryPort;
};

export const makeCreateDefaultClassificationsCommandHandler = ({
	classificationRepository,
	classificationFactory,
}: CreateDefaultClassificationsCommandHandlerDeps): ICreateDefaultClassificationsCommandHandlerPort => {
	return {
		execute: () => {
			const defaultClassifications = buildDefaultClassifications({ classificationFactory });

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
		},
	};
};
