import type { ExtensionRegistrationId, GameId, GameSessionId } from "../domain";

export type DomainEvent = { id: string; occurredAt: Date } & (
	| {
			name: "take-screenshot";
			payload: { gameId: GameId };
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
			name: "extension-registration-created";
			payload: { registrationId: ExtensionRegistrationId };
	  }
	| {
			name: "extension-registration-removed";
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
	| {
			name: "game-library-synchronized";
			payload: { added: GameId[]; updated: GameId[]; deleted: GameId[] };
	  }
);

export type Listener<T extends DomainEvent = DomainEvent> = (event: T) => void;
