import type { IEntityFactoryPort } from "@playatlas/common/application";
import { TagIdParser } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import { monotonicFactory } from "ulid";
import { makeTag, rehydrateTag, type Tag } from "../domain/tag.entity";
import type { MakeTagProps, RehydrateTagProps } from "../domain/tag.entity.types";

type MakeTagPropsWithOptionalId = Omit<MakeTagProps, "id"> & {
	id?: MakeTagProps["id"];
};

export type ITagFactoryPort = IEntityFactoryPort<
	MakeTagPropsWithOptionalId,
	RehydrateTagProps,
	Tag
>;

export type TagFactoryDeps = {
	clock: IClockPort;
};

export const makeTagFactory = (deps: TagFactoryDeps): ITagFactoryPort => {
	const ulid = monotonicFactory();

	return {
		create: (props) => makeTag({ ...props, id: props.id ?? TagIdParser.fromTrusted(ulid()) }, deps),
		rehydrate: (props) => rehydrateTag(props, deps),
	};
};
