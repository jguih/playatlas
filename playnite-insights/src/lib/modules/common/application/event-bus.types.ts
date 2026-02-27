export type DomainEvent = { id: string; occurredAt: Date } & (
	| {
			name: "login-successful";
	  }
	| {
			name: "registration-successful";
	  }
	| {
			name: "sync-finished";
	  }
	| {
			name: "game-library-updated";
	  }
	| {
			name: "game-sessions-updated";
	  }
);

export type Listener<T extends DomainEvent = DomainEvent> = (event: T) => void;
