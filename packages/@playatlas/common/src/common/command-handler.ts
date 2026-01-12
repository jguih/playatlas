export type ICommandHandlerPort<TCommand, TResult> = {
  execute: (command: TCommand) => TResult;
};

export type IAsyncCommandHandlerPort<TCommand, TResult> = {
  executeAsync: (command: TCommand) => Promise<TResult>;
};
