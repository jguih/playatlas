import { faker } from "@faker-js/faker";
import { type TestEntityFactory } from "@playatlas/common/testing";
import type { IExtensionRegistrationFactoryPort } from "../application";
import { type ExtensionRegistration } from "../domain/extension-registration.entity";
import type { MakeExtensionRegistrationProps } from "../domain/extension-registration.entity.types";

export type ExtensionRegistrationFactory = TestEntityFactory<
	MakeExtensionRegistrationProps,
	ExtensionRegistration
>;

type ExtensionRegistrationFactoryDeps = {
	extensionRegistrationFactory: IExtensionRegistrationFactoryPort;
};

export const makeExtensionRegistrationFactory = ({
	extensionRegistrationFactory,
}: ExtensionRegistrationFactoryDeps): ExtensionRegistrationFactory => {
	const propOrDefault = <T, V>(prop: T | undefined, value: V) => {
		if (prop === undefined) return value;
		return prop;
	};

	const build: ExtensionRegistrationFactory["build"] = (props = {}) => {
		return extensionRegistrationFactory.create({
			extensionId: propOrDefault(props.extensionId, faker.string.uuid()),
			extensionVersion: propOrDefault(props.extensionVersion, faker.string.uuid()),
			hostname: propOrDefault(props.hostname, faker.internet.domainName()),
			os: propOrDefault(props.os, faker.hacker.noun()),
			publicKey: propOrDefault(props.publicKey, faker.internet.password()),
		});
	};

	const buildList: ExtensionRegistrationFactory["buildList"] = (n, props = {}) => {
		return Array.from({ length: n }, () => build(props));
	};

	return { build, buildList };
};
