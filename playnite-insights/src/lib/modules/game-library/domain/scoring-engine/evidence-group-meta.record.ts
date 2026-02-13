import type { EvidenceGroupRole } from "@playatlas/common/domain";

export type EvidenceGroupMeta = Record<
	string,
	{
		role: EvidenceGroupRole;
		userFacing: boolean;
	}
>;
