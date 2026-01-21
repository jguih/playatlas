import { validation } from "@playatlas/common/application";
import { InvalidArgumentError, InvalidStateError, type BaseEntity } from "@playatlas/common/domain";
import type {
	BuildInstanceAuthSettingsProps,
	MakeInstanceAuthSettingsDeps,
	MakeInstanceAuthSettingsProps,
	RehydrateInstanceAuthSettingsProps,
} from "./instance-auth-settings.entity.types";

export type InstanceAuthSettingsId = 1;
export type InstanceAuthSettings = BaseEntity<InstanceAuthSettingsId> &
	Readonly<{
		getPasswordHash: () => string;
		setInstanceCredentials: (props: { hash: string; salt: string }) => void;
		getSalt: () => string;
	}>;

const buildInstanceAuthSettings = (
	props: BuildInstanceAuthSettingsProps,
	{ clock }: MakeInstanceAuthSettingsDeps,
): InstanceAuthSettings => {
	const now = clock.now();

	let _password_hash = props.passwordHash;
	let _salt = props.salt;
	const _created_at = props.createdAt ?? now;
	let _last_updated_at = props.lastUpdatedAt ?? now;

	const _validate = () => {
		if (validation.isNullOrEmptyString(_password_hash))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("PasswordHash"));
		if (validation.isNullOrEmptyString(_salt))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("Salt"));
	};

	_validate();

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	const authSettings: InstanceAuthSettings = {
		getId: () => 1,
		getSafeId: () => "1",
		getPasswordHash: () => _password_hash,
		setInstanceCredentials: ({ hash, salt }) => {
			if (validation.isNullOrEmptyString(hash))
				throw new InvalidArgumentError(validation.message.isNullOrEmptyString("hash"));
			if (validation.isNullOrEmptyString(salt))
				throw new InvalidArgumentError(validation.message.isNullOrEmptyString("salt"));
			_password_hash = hash;
			_salt = salt;
			_touch();
			_validate();
		},
		getSalt: () => _salt,
		getCreatedAt: () => _created_at,
		getLastUpdatedAt: () => _last_updated_at,
		validate: _validate,
	};
	return Object.freeze(authSettings);
};

export const makeInstanceAuthSettings = (
	props: MakeInstanceAuthSettingsProps,
	deps: MakeInstanceAuthSettingsDeps,
): InstanceAuthSettings => {
	return buildInstanceAuthSettings(props, deps);
};

export const rehydrateInstanceAuthSettings = (
	props: RehydrateInstanceAuthSettingsProps,
	deps: MakeInstanceAuthSettingsDeps,
): InstanceAuthSettings => {
	return buildInstanceAuthSettings(props, deps);
};
