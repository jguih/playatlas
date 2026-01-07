export type DomainEvent = {
  id: string;
  name: "take-screenshot";
  payload: { gameId: string };
  occurredAt: Date;
};

export type Listener<T extends DomainEvent = DomainEvent> = (event: T) => void;
