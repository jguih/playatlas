import { ExtensionRegistrationId } from "@playatlas/common/domain";
import { ExtensionRegistrationStatus } from "./extension-registration.entity";

type Base = {
  id: ExtensionRegistrationId;
  status: ExtensionRegistrationStatus;
  createdAt: Date;
  lastUpdatedAt: Date;
};

type CommonProps = {
  extensionId: string;
  publicKey: string;
  hostname: string | null;
  os: string | null;
  extensionVersion: string | null;
};

export type BuildExtensionRegistrationProps = Partial<Base> & CommonProps;

export type MakeExtensionRegistrationProps = CommonProps;

export type RehydrateExtensionRegistrationProps = Base & CommonProps;
