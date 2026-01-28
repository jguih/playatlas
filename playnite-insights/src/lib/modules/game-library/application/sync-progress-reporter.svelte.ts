export type SyncFlowKey = "games" | "completion-statuses" | "companies" | "genres";

export type SyncProgressEvent =
	| { type: "sync-started" }
	| { type: "flow-started"; flow: SyncFlowKey }
	| { type: "flow-finished"; flow: SyncFlowKey }
	| { type: "sync-finished" };

export type SyncProgressEventType = SyncProgressEvent["type"];

type SyncProgressSignal =
	| {
			running: true;
			activeFlow: SyncFlowKey;
	  }
	| {
			running: false;
			activeFlow: null;
	  };

export interface ISyncProgressReporterPort {
	get progressSignal(): SyncProgressSignal;
	report(event: SyncProgressEvent): void;
}

export class SyncProgressReport implements ISyncProgressReporterPort {
	progressSignal: SyncProgressSignal = $state({
		running: false,
		activeFlow: null,
	});
	#runningTimeout: ReturnType<typeof setTimeout> | undefined = $state();

	constructor() {}

	report: ISyncProgressReporterPort["report"] = (event) => {
		switch (event.type) {
			case "sync-started":
				this.#runningTimeout = setTimeout(() => {
					this.progressSignal.running = true;
					this.progressSignal.activeFlow = null;
				}, 300);
				break;
			case "sync-finished":
				if (this.#runningTimeout) clearTimeout(this.#runningTimeout);
				this.progressSignal.running = false;
				this.progressSignal.activeFlow = null;
				break;
			case "flow-started":
				this.progressSignal.activeFlow = event.flow;
				break;
			case "flow-finished":
				this.progressSignal.activeFlow = null;
				break;
			default:
				this.progressSignal.running = false;
				this.progressSignal.activeFlow = null;
		}
	};
}
