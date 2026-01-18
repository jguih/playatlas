import { faker } from "@faker-js/faker";
import { CompletionStatusIdParser } from "@playatlas/common/domain";
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

export type CompletionStatusFactory = {
	buildCompletionStatus: (props?: Partial<MakeCompletionStatusProps>) => CompletionStatus;
	buildDefaultCompletionStatusList: () => CompletionStatus[];
};

export type CompletionStatusFactoryDeps = {
	completionStatusFactory: ICompletionStatusFactoryPort;
};

export const makeCompletionStatusFactory = ({
	completionStatusFactory,
}: CompletionStatusFactoryDeps): CompletionStatusFactory => {
	const buildCompletionStatus: CompletionStatusFactory["buildCompletionStatus"] = (props = {}) => {
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
			lastUpdatedAt: props.lastUpdatedAt ?? faker.date.recent(),
		});
	};

	const buildDefaultCompletionStatusList: CompletionStatusFactory["buildDefaultCompletionStatusList"] =
		() => {
			const list: CompletionStatus[] = [];
			for (const value of Object.values(completionStatusName))
				list.push(buildCompletionStatus({ name: value }));
			return list;
		};

	return {
		buildCompletionStatus,
		buildDefaultCompletionStatusList,
	};
};
