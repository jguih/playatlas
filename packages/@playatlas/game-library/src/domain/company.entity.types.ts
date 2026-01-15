import type { CompanyId } from "@playatlas/common/domain";

export type MakeCompanyProps = {
	id: CompanyId;
	name: string;
	lastUpdatedAt: Date;
};
