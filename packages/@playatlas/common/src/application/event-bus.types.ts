import { ExtensionRegistrationId, GameId } from "../domain";
import { GameSessionId } from "../domain/value-object/game-session-id";

export type DomainEvent = { id: string; occurredAt: Date } & (
  | {
      name: "take-screenshot";
      payload: { gameId: string };
    }
  | {
      name: "extension-registration-approved";
      payload: { registrationId: ExtensionRegistrationId };
    }
  | {
      name: "extension-registration-rejected";
      payload: { registrationId: ExtensionRegistrationId };
    }
  | {
      name: "extension-registration-revoked";
      payload: { registrationId: ExtensionRegistrationId };
    }
  | {
      name: "opened-game-session";
      payload: { gameId: GameId; sessionId: GameSessionId };
    }
  | {
      name: "closed-game-session";
      payload: { gameId: GameId; sessionId: GameSessionId };
    }
  | {
      name: "staled-game-session";
      payload: { gameId: GameId; sessionId: GameSessionId };
    }
);

export type Listener<T extends DomainEvent = DomainEvent> = (event: T) => void;
