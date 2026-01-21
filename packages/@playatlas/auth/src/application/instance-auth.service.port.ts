export type InstanceAuthServiceVerifyResult = {
	reason: string;
	authorized: boolean;
};

type RegisterResult =
	| {
			success: false;
			reason: string;
			reason_code: "instance_already_registered";
	  }
	| {
			success: true;
			reason: string;
			reason_code: "instance_registered";
	  };

type LoginResult =
	| {
			success: false;
			reason: string;
			reason_code: "";
	  }
	| {
			success: true;
			reason: string;
			reason_code: "created_session_id";
			sessionId: string;
	  };

export type IInstanceAuthServicePort = {
	verify: (args: { request: Request }) => InstanceAuthServiceVerifyResult;
	registerAsync: (props: { password: string }) => Promise<RegisterResult>;
	loginAsync: (props: { password: string }) => Promise<LoginResult>;
};
