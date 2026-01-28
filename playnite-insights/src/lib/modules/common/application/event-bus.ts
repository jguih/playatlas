import type { IDomainEventBusPort } from "./event-bus.port";
import type { DomainEvent, Listener } from "./event-bus.types";

export class EventBus implements IDomainEventBusPort {
	private readonly listeners = new Set<Listener>();
	private readonly nameListeners = new Map<DomainEvent["name"], Listener>();

	emit: IDomainEventBusPort["emit"] = (event) => {
		for (const listener of this.listeners) {
			listener(event);
		}
		for (const [name, listener] of this.nameListeners) {
			if (event.name === name) listener(event);
		}
	};

	subscribe: IDomainEventBusPort["subscribe"] = (listener: Listener) => {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	};

	on: IDomainEventBusPort["on"] = (name, listener) => {
		this.nameListeners.set(name, listener);

		return () => {
			this.nameListeners.delete(name);
		};
	};
}
