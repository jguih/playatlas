export type DomainEvent = { id: string; occurredAt: Date } & (
	| {
			name: "login-successful";
	  }
	| {
			name: "sync-finished";
	  }
);

export type Listener<T extends DomainEvent = DomainEvent> = (event: T) => void;
