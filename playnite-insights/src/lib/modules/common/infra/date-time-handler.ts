import type { IServerTimeStorePort } from "../stores/server-time.store.port";
import type { IDateTimeHandlerPort } from "./date-time-handler.port";

export type DateTimeHandlerProps = {
	serverTimeStore: IServerTimeStorePort;
};

export class DateTimeHandler implements IDateTimeHandlerPort {
	#serverTimeStore: DateTimeHandlerProps["serverTimeStore"];

	constructor({ serverTimeStore }: DateTimeHandlerProps) {
		this.#serverTimeStore = serverTimeStore;
	}

	getUtcNow = () => {
		if (
			!this.#serverTimeStore.serverTimeSignal.syncPoint ||
			!this.#serverTimeStore.serverTimeSignal.utcNow
		)
			return Date.now();
		const elapsed = performance.now() - this.#serverTimeStore.serverTimeSignal.syncPoint;
		return this.#serverTimeStore.serverTimeSignal.utcNow + elapsed;
	};
}
