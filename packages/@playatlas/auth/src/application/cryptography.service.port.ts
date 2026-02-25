import type { InstanceSessionId } from "../domain/value-object/instance-session-id";

export type ICryptographyServicePort = {
	hashPassword: (password: string) => Promise<{ salt: string; hash: string }>;
	verifyPassword: (password: string, args: { salt: string; hash: string }) => boolean;
	createSessionId: () => InstanceSessionId;
	compareSessionIds: (id1: string, id2: string) => boolean;
};
