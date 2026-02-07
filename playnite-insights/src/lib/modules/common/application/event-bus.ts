import type { IDomainEventBusPort } from "./event-bus.port";
import type { DomainEvent, Listener } from "./event-bus.types";

export class EventBus implements IDomainEventBusPort {
	private readonly listeners = new Set<Listener>();
	private readonly nameListeners = new Map<DomainEvent["name"], Set<Listener>>();

	emit: IDomainEventBusPort["emit"] = (event) => {
		const notifyListeners = (listeners: Set<Listener>) => {
			for (const listener of listeners) {
				listener(event);
			}
		};

		notifyListeners(this.listeners);

		for (const [name, listeners] of this.nameListeners) {
			if (event.name === name) notifyListeners(listeners);
		}
	};

	subscribe: IDomainEventBusPort["subscribe"] = (listener: Listener) => {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	};

	on: IDomainEventBusPort["on"] = (name, listener) => {
		const listeners = this.nameListeners.get(name);
		if (!listeners) this.nameListeners.set(name, new Set());
		this.nameListeners.get(name)!.add(listener);

		return () => {
			this.nameListeners.get(name)!.delete(listener);
		};
	};
}
