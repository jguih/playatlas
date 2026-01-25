import type { IAsyncCommandHandlerPort } from "$lib/modules/common/common";
import type { ICompletionStatusRepositoryPort } from "../../infra/completion-status.repository.port";
import type { SyncCompletionStatusesCommand } from "./sync-completion-statuses.command";

export type ISyncCompletionStatusesCommandHandlerPort = IAsyncCommandHandlerPort<
	SyncCompletionStatusesCommand,
	void
>;

export type SyncCompletionStatusesCommandHandlerDeps = {
	completionStatusRepository: ICompletionStatusRepositoryPort;
};

export class SyncCompletionStatusesCommandHandler implements ISyncCompletionStatusesCommandHandlerPort {
	private completionStatusRepository: ICompletionStatusRepositoryPort;

	constructor({ completionStatusRepository }: SyncCompletionStatusesCommandHandlerDeps) {
		this.completionStatusRepository = completionStatusRepository;
	}

	executeAsync: ISyncCompletionStatusesCommandHandlerPort["executeAsync"] = async (command) => {
		return await this.completionStatusRepository.syncAsync(command.completionStatuses);
	};
}
