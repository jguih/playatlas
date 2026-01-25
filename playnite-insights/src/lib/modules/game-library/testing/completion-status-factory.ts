import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import type { CompletionStatus } from "../domain/completion-status.entity";

export type ICompletionStatusFactoryPort = IClientEntityFactoryPort<CompletionStatus>;

export class CompletionStatusFactory implements ICompletionStatusFactoryPort {
	private buildCompletionStatus = (): CompletionStatus => {
		const SourceUpdatedAt = faker.date.recent();
		return {
			Id: faker.string.uuid(),
			Name: faker.word.noun(),
			SourceUpdatedAt,
			SourceUpdatedAtMs: SourceUpdatedAt.getTime(),
			Sync: {
				Status: "synced",
				LastSyncedAt: faker.date.recent(),
				ErrorMessage: null,
			},
		};
	};

	build: ICompletionStatusFactoryPort["build"] = () => {
		return this.buildCompletionStatus();
	};

	buildList: ICompletionStatusFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildCompletionStatus());
	};
}
