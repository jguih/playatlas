import type { CompanyId, PlayniteCompanyId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import type { CompanyName } from "./company.entity";

type CommonProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type BaseProps = {
	id: CompanyId;
	name: string;
	deletedAt?: Date | null;
	deleteAfter?: Date | null;
	playniteId?: PlayniteCompanyId | null;
};

export type MakeCompanyProps = Partial<CommonProps> & BaseProps;

export type RehydrateCompanyProps = CommonProps & BaseProps;

export type MakeCompanyDeps = {
	clock: IClockPort;
};

export type UpdateCompanyFromPlayniteProps = {
	name: CompanyName;
	playniteId: PlayniteCompanyId;
};
