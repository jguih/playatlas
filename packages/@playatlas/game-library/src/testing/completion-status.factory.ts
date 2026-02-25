import { faker } from "@faker-js/faker";
import {
	CompletionStatusIdParser,
	PlayniteCompletionStatusIdParser,
} from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import { monotonicFactory } from "ulid";
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

export type TestCompletionStatusFactory = TestEntityFactory<
	MakeCompletionStatusProps,
	CompletionStatus
> & {
	buildDefaultList: () => CompletionStatus[];
};

export type TestCompletionStatusFactoryDeps = {
	completionStatusFactory: ICompletionStatusFactoryPort;
};

export const makeTestCompletionStatusFactory = ({
	completionStatusFactory,
}: TestCompletionStatusFactoryDeps): TestCompletionStatusFactory => {
	const createBuilder = (ulid = monotonicFactory()) => ({
		build: (props: Partial<MakeCompletionStatusProps> = {}) => {
			return completionStatusFactory.create({
				id: CompletionStatusIdParser.fromExternal(props.id ?? ulid()),
				name:
					props.name ??
					faker.helpers.arrayElement([
						completionStatusName.playing,
						completionStatusName.played,
						completionStatusName.completed,
						completionStatusName.abandoned,
						completionStatusName.toPlay,
					]),
				playniteId:
					props.playniteId ?? PlayniteCompletionStatusIdParser.fromTrusted(faker.string.uuid()),
			});
		},
	});

	const buildDefaultCompletionStatusList: TestCompletionStatusFactory["buildDefaultList"] = () => {
		const list: CompletionStatus[] = [];
		const builder = createBuilder();
		for (const value of Object.values(completionStatusName))
			list.push(builder.build({ name: value }));
		return list;
	};

	const buildList: TestCompletionStatusFactory["buildList"] = (n, props) => {
		const builder = createBuilder();
		return Array.from({ length: n }, () => builder.build(props));
	};

	const build: TestCompletionStatusFactory["build"] = (props) => {
		const builder = createBuilder();
		return builder.build(props);
	};

	return {
		build,
		buildList,
		buildDefaultList: buildDefaultCompletionStatusList,
	};
};
