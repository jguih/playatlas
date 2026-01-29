import { validation } from "@playatlas/common/application";
import { makeSoftDeletable, type EntitySoftDeleteProps } from "@playatlas/common/common";
import {
	InvalidStateError,
	type BaseEntity,
	type CompanyId,
	type PlayniteCompanyId,
} from "@playatlas/common/domain";
import type {
	MakeCompanyDeps,
	MakeCompanyProps,
	RehydrateCompanyProps,
	UpdateCompanyFromPlayniteProps,
} from "./company.entity.types";

export type CompanyName = string;

export type Company = BaseEntity<CompanyId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => CompanyName;
		getPlayniteId: () => PlayniteCompanyId | null;
		updateFromPlaynite: (value: UpdateCompanyFromPlayniteProps) => boolean;
	}>;

export const makeCompany = (props: MakeCompanyProps, { clock }: MakeCompanyDeps): Company => {
	const now = clock.now();

	const _id: CompanyId = props.id;
	let _playnite_id = props.playniteId ?? null;
	let _name: CompanyName = props.name;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	const _created_at = props.createdAt ?? now;

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Company name must not be empty");
	};

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{ deletedAt: props.deletedAt, deleteAfter: props.deleteAfter },
		{ clock, touch: _touch, validate: _validate },
	);

	const company: Company = {
		getId: () => _id,
		getSafeId: () => _id,
		getPlayniteId: () => _playnite_id,
		getName: () => _name,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		updateFromPlaynite: ({ name, playniteId }) => {
			let updated = false;

			if (name === _name) updated = true;
			if (playniteId === _playnite_id) updated = true;

			if (!updated) return updated;

			_name = name;
			_playnite_id = playniteId;

			_touch();
			_validate();
			return updated;
		},
		validate: _validate,
		...softDelete,
	};
	return Object.freeze(company);
};

export const rehydrateCompany = (props: RehydrateCompanyProps, deps: MakeCompanyDeps) =>
	makeCompany(props, deps);
