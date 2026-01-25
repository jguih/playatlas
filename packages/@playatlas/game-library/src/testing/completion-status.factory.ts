import { faker } from "@faker-js/faker";
import { CompletionStatusIdParser } from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import type { ICompletionStatusFactoryPort } from "../application/completion-status.factory";
import { type CompletionStatus } from "../domain/completion-status.entity";
import type { MakeCompletionStatusProps } from "../domain/completion-status.entity.types";

const completionStatusName = {
	playing: "playing",
	played: "played",
	completed: "completed",
	abandoned: "abandoned",
	toPlay: "to play",
} as const;

export type CompletionStatusFactory = TestEntityFactory<
	MakeCompletionStatusProps,
	CompletionStatus
> & {
	buildDefaultList: () => CompletionStatus[];
};

export type CompletionStatusFactoryDeps = {
	completionStatusFactory: ICompletionStatusFactoryPort;
};

export const makeCompletionStatusFactory = ({
	completionStatusFactory,
}: CompletionStatusFactoryDeps): CompletionStatusFactory => {
	const build: CompletionStatusFactory["build"] = (props = {}) => {
		return completionStatusFactory.create({
			id: CompletionStatusIdParser.fromExternal(props.id ?? faker.string.uuid()),
			name:
				props.name ??
				faker.helpers.arrayElement([
					completionStatusName.playing,
					completionStatusName.played,
					completionStatusName.completed,
					completionStatusName.abandoned,
					completionStatusName.toPlay,
				]),
		});
	};

	const buildDefaultCompletionStatusList: CompletionStatusFactory["buildDefaultList"] = () => {
		const list: CompletionStatus[] = [];
		for (const value of Object.values(completionStatusName)) list.push(build({ name: value }));
		return list;
	};

	const buildList: CompletionStatusFactory["buildList"] = (n, props) => {
		return Array.from({ length: n }, () => build(props));
	};

	return {
		build,
		buildList,
		buildDefaultList: buildDefaultCompletionStatusList,
	};
};
