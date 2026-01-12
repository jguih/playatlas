import { ExtensionRegistrationId } from "../domain";

export type DomainEvent = { id: string; occurredAt: Date } & (
  | {
      name: "take-screenshot";
      payload: { gameId: string };
    }
  | {
      name: "extension-registration-approved";
      payload: { registrationId: ExtensionRegistrationId };
    }
);

export type Listener<T extends DomainEvent = DomainEvent> = (event: T) => void;
