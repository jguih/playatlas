import type { DomainEvent } from "@playatlas/common/application";
import { api } from "./vitest.global.setup";

export const recordDomainEvents = () => {
	const events: DomainEvent[] = [];
	const unsubscribe = api.getEventBus().subscribe((event) => events.push(event));
	return { events, unsubscribe };
};
