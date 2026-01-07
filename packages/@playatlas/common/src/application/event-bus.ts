import type { DomainEvent, Listener } from "./event-bus.types";
import { LogService } from "./log-service.port";

export type EventBusDeps = {
  logService: LogService;
};

export const makeEventBus = ({ logService }: EventBusDeps) => {
  const listeners = new Set<Listener>();

  const emit = (event: DomainEvent) => {
    for (const listener of listeners) {
      listener(event);
      logService.debug(`Emitted event ${event.name}`);
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
