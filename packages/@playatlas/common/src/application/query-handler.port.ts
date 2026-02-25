export type IQueryHandlerPort<P, R> = {
	execute: (props?: P) => R;
};
