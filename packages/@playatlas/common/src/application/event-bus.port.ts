import type { DomainEvent, Listener } from "./event-bus.types";

export type DomainEventBus = {
  emit: (event: DomainEvent) => void;
  subscribe: (listener: Listener) => () => void;
};
