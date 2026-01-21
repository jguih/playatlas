import { validation } from "@playatlas/common/application";
import {
	type BaseEntity,
	type ExtensionRegistrationId,
	InvalidOperationError,
	InvalidStateError,
} from "@playatlas/common/domain";
import { extensionRegistrationStatus } from "./extension-registration.constants";
import type {
	BuildExtensionRegistrationProps,
	MakeExtensionRegistrationDeps,
	MakeExtensionRegistrationProps,
	RehydrateExtensionRegistrationProps,
} from "./extension-registration.entity.types";

export type ExtensionRegistrationStatus = keyof typeof extensionRegistrationStatus;

export type ExtensionRegistrationExtensionId = string;

export type ExtensionRegistration = BaseEntity<ExtensionRegistrationId> &
	Readonly<{
		setId: (value: ExtensionRegistrationId) => void;
		getExtensionId: () => ExtensionRegistrationExtensionId;
		getPublicKey: () => string;
		getHostname: () => string | null;
		getOs: () => string | null;
		getExtensionVersion: () => string | null;
		getStatus: () => ExtensionRegistrationStatus;
		isTrusted: () => boolean;
		isPending: () => boolean;
		isRejected: () => boolean;
		approve: () => void;
		reject: () => void;
		revoke: () => void;
	}>;

const buildExtensionRegistration = (
	props: BuildExtensionRegistrationProps,
	{ clock }: MakeExtensionRegistrationDeps,
): ExtensionRegistration => {
	const now = clock.now();

	let _id: ExtensionRegistrationId | null = props.id ?? null;
	const _extension_id = props.extensionId;
	const _public_key = props.publicKey;
	const _hostname = props.hostname;
	const _os = props.os;
	const _extensionVersion = props.extensionVersion;
	let _status: ExtensionRegistrationStatus = props.status ?? "pending";
	const _createdAt: Date = props.createdAt ?? now;
	let _lastUpdatedAt: Date = props.lastUpdatedAt ?? now;

	const NO_EMPTY_STRING_FIELDS = [
		{ name: "Extension Id", extract: () => _extension_id },
		{ name: "Public Key", extract: () => _public_key },
	] as const;

	const NULL_OR_NON_EMPTY_FIELDS = [
		{ name: "Hostname", extract: () => _hostname },
		{ name: "Os", extract: () => _os },
		{ name: "Extension Version", extract: () => _extensionVersion },
	] as const;

	const _validate = Object.freeze(() => {
		if (!(_status in extensionRegistrationStatus))
			throw new InvalidStateError(`Invalid status: ${_status}`);

		for (const f of NO_EMPTY_STRING_FIELDS)
			if (validation.isEmptyString(f.extract()))
				throw new InvalidStateError(validation.message.isEmptyString(f.name));

		for (const f of NULL_OR_NON_EMPTY_FIELDS)
			if (!validation.isNullOrNonEmptyString(f.extract()))
				throw new InvalidStateError(validation.message.isNullOrNonEmptyString(f.name, f.extract()));
	});

	const _touch = () => {
		_lastUpdatedAt = clock.now();
	};

	_validate();

	const extensionRegistration: ExtensionRegistration = {
		getId: () => {
			if (!_id) throw new InvalidStateError("Id is null until the entity is persisted!");
			return _id;
		},
		getSafeId: () => (_id ? String(_id) : "<not_persisted>"),
		setId: (value) => {
			if (_id) throw new InvalidStateError("Id is already set");
			_id = value;
		},
		getExtensionId: () => _extension_id,
		getPublicKey: () => _public_key,
		getHostname: () => _hostname,
		getOs: () => _os,
		getExtensionVersion: () => _extensionVersion,
		getStatus: () => _status,
		getCreatedAt: () => _createdAt,
		getLastUpdatedAt: () => _lastUpdatedAt,
		validate: _validate,
		isTrusted: () => _status === "trusted",
		isPending: () => _status === "pending",
		isRejected: () => _status === "rejected",
		approve: () => {
			if (_status !== "pending")
				throw new InvalidOperationError("Cannot approve non-pending registration");
			_status = "trusted";
			_touch();
		},
		reject: () => {
			if (_status !== "pending")
				throw new InvalidOperationError("Cannot reject non-pending registration");
			_status = "rejected";
			_touch();
		},
		revoke: () => {
			if (_status !== "trusted")
				throw new InvalidOperationError("Cannot revoke not trusted registration");
			_status = "rejected";
			_touch();
		},
	};
	return Object.freeze(extensionRegistration);
};

export const makeExtensionRegistration = (
	props: MakeExtensionRegistrationProps,
	deps: MakeExtensionRegistrationDeps,
) => {
	return buildExtensionRegistration({ ...props, status: "pending" }, deps);
};

export const rehydrateExtensionRegistration = (
	props: RehydrateExtensionRegistrationProps,
	deps: MakeExtensionRegistrationDeps,
) => {
	return buildExtensionRegistration(props, deps);
};
