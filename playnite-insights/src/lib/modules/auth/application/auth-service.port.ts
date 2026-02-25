import type { LoginInstanceResponseDto, RegisterInstanceResponseDto } from "@playatlas/auth/dtos";

export type IAuthServicePort = {
	loginAsync: (props: { password: string }) => Promise<LoginInstanceResponseDto>;
	registerAsync: (props: { password: string }) => Promise<RegisterInstanceResponseDto>;
};
