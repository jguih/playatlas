import type { DomainEvent, Listener } from "./event-bus.types";

export type IDomainEventBusPort = {
	emit: (event: DomainEvent) => void;
	subscribe: (listener: Listener) => () => void;
};
