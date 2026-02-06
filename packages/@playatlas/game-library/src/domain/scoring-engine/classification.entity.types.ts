import type { IClockPort } from "@playatlas/common/infra";
import type { ClassificationId } from "../value-object";
import type { ClassificationCategory } from "../value-object/classification-category";

type SyncProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type BaseProps = {
	id: ClassificationId;
	displayName: string;
	description: string;
	category: ClassificationCategory;
};

export type MakeClassificationProps = Partial<SyncProps> & BaseProps;

export type RehydrateClassificationProps = SyncProps & BaseProps;

export type MakeClassificationDeps = {
	clock: IClockPort;
};
