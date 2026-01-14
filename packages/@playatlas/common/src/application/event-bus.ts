import type { DomainEvent, Listener } from "./event-bus.types";
import type { ILogServicePort } from "./log-service.port";

export type EventBusDeps = {
	logService: ILogServicePort;
};

export const makeEventBus = ({ logService }: EventBusDeps) => {
	const listeners = new Set<Listener>();

	const emit = (event: DomainEvent) => {
		logService.debug(
			`Emitted event (Name: ${event.name}, Id: ${event.id}, OccurredAt: ${event.occurredAt})`,
		);
		for (const listener of listeners) {
			listener(event);
		}
	};

	const subscribe = (listener: Listener) => {
		listeners.add(listener);

		return () => {
			listeners.delete(listener);
		};
	};

	return {
		emit,
		subscribe,
	};
};
