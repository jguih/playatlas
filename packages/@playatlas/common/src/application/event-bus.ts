import type { DomainEvent, IDomainEventBusPort } from ".";
import type { Listener } from "./event-bus.types";
import type { ILogServicePort } from "./log-service.port";

export type EventBusDeps = {
	logService: ILogServicePort;
};

export const makeEventBus = ({ logService }: EventBusDeps): IDomainEventBusPort => {
	const listeners = new Set<Listener>();
	const nameListeners = new Map<DomainEvent["name"], Set<Listener>>();

	const emit: IDomainEventBusPort["emit"] = (event) => {
		logService.debug(
			`Emitted event (Name: ${event.name}, Id: ${event.id}, OccurredAt: ${event.occurredAt.toLocaleString()})`,
		);

		const notifyListeners = (listeners: Set<Listener>) => {
			for (const listener of listeners) {
				listener(event);
			}
		};

		notifyListeners(listeners);

		for (const [name, listeners] of nameListeners) {
			if (event.name === name) notifyListeners(listeners);
		}
	};

	const subscribe: IDomainEventBusPort["subscribe"] = (listener) => {
		listeners.add(listener);

		return () => {
			listeners.delete(listener);
		};
	};

	const on: IDomainEventBusPort["on"] = (name, listener) => {
		const listeners = nameListeners.get(name);
		if (!listeners) nameListeners.set(name, new Set());
		nameListeners.get(name)!.add(listener);

		return () => {
			nameListeners.get(name)!.delete(listener);
		};
	};

	return {
		emit,
		subscribe,
		on,
	};
};
