export type AuthFlowLoginResult =
	| {
			success: true;
			reason_code: "logged_in";
	  }
	| {
			success: false;
			reason_code:
				| "invalid_credentials"
				| "instance_not_registered"
				| "validation_error"
				| "network_error"
				| "unknown_error";
	  };

export interface IAuthFlowPort {
	loginAsync: (props: { password: string }) => Promise<AuthFlowLoginResult>;
}
