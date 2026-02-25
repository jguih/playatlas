import { validation } from "@playatlas/common/application";
import { InvalidStateError, type BaseEntity } from "@playatlas/common/domain";
import type {
	BuildInstanceSessionProps,
	MakeInstanceSessionDeps,
	MakeInstanceSessionProps,
	RehydrateInstanceSessionProps,
} from "./instance-session.entity.types";
import type { InstanceSessionId } from "./value-object/instance-session-id";

export type InstanceSession = BaseEntity<InstanceSessionId> &
	Readonly<{
		getLastUsedAt: () => Date;
	}>;

const buildInstanceSession = (
	props: BuildInstanceSessionProps,
	{ clock }: MakeInstanceSessionDeps,
): InstanceSession => {
	const now = clock.now();

	const _session_id = props.sessionId;
	const _created_at = props.createdAt ?? now;
	const _last_used_at = props.lastUsedAt ?? now;
	const _last_updated_at = props.lastUpdatedAt ?? now;

	const _validate = () => {
		if (validation.isNullOrEmptyString(_session_id))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("Session Id"));
	};

	_validate();

	const session: InstanceSession = {
		getId: () => _session_id,
		getSafeId: () => "<redacted>",
		getCreatedAt: () => _created_at,
		getLastUsedAt: () => _last_used_at,
		getLastUpdatedAt: () => _last_updated_at,
		validate: _validate,
	};
	return Object.freeze(session);
};

export const makeInstanceSession = (
	props: MakeInstanceSessionProps,
	deps: MakeInstanceSessionDeps,
) => {
	return buildInstanceSession(props, deps);
};

export const rehydrateInstanceSession = (
	props: RehydrateInstanceSessionProps,
	deps: MakeInstanceSessionDeps,
) => {
	return buildInstanceSession(props, deps);
};
