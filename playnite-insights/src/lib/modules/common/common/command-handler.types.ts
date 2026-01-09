export interface ICommandHandlerPort<TCommand, TCommandResult> {
	execute(command: TCommand): TCommandResult;
}

export interface IAsyncCommandHandlerPort<TCommand, TCommandResult> {
	executeAsync(command: TCommand): Promise<TCommandResult>;
}
