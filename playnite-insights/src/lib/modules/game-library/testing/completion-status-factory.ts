import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import {
	CompletionStatusIdParser,
	type CompletionStatus,
} from "../domain/completion-status.entity";

export type ICompletionStatusFactoryPort = IClientEntityFactoryPort<CompletionStatus>;

export class CompletionStatusFactory implements ICompletionStatusFactoryPort {
	private buildCompletionStatus = (): CompletionStatus => {
		return {
			Id: CompletionStatusIdParser.fromTrusted(faker.string.ulid()),
			Name: faker.word.noun(),
			SourceLastUpdatedAt: faker.date.recent(),
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
