export type InstanceAuthServiceVerifyResult = {
	reason: string;
	authorized: boolean;
};

export type IInstanceAuthServicePort = {
	verify: (args: { request: Request }) => InstanceAuthServiceVerifyResult;
};
