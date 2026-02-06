import type { IClockPort } from "@playatlas/common/infra";
import type { ClassificationId } from "../value-object";
import type { ClassificationCategory } from "../value-object/classification-category";

type SyncProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type SoftDeleteProps = {
	deletedAt: Date | null;
	deleteAfter: Date | null;
};

type BaseProps = {
	id: ClassificationId;
	displayName: string;
	description: string;
	category: ClassificationCategory;
	version: string;
};

export type MakeClassificationProps = Partial<SyncProps> & BaseProps & Partial<SoftDeleteProps>;

export type RehydrateClassificationProps = SyncProps & BaseProps & SoftDeleteProps;

export type MakeClassificationDeps = {
	clock: IClockPort;
};

export type UpdateClassificationProps = Omit<BaseProps, "id">;
