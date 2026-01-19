import type { DatabaseSync } from "node:sqlite";

type RunSavePointProps<T> = {
	getDb: () => DatabaseSync;
	fn: (props: { db: DatabaseSync }) => T;
};

export type RunSavePoint = <T>(props: RunSavePointProps<T>) => T;

export const runSavePoint: RunSavePoint = ({ fn, getDb }) => {
	const db = getDb();
	const savepoint = `sp_${crypto.randomUUID()}`;

	db.exec(`SAVEPOINT "${savepoint}"`);
	try {
		const result = fn({ db });
		db.exec(`RELEASE SAVEPOINT "${savepoint}"`);
		return result;
	} catch (error) {
		db.exec(`ROLLBACK TO SAVEPOINT "${savepoint}"`);
		throw error;
	}
};

type RunSavePointAsyncProps<T> = {
	getDb: () => DatabaseSync;
	fn: (props: { db: DatabaseSync }) => Promise<T>;
};

export type RunSavePointAsync = <T>(props: RunSavePointAsyncProps<T>) => Promise<T>;

export const runSavePointAsync: RunSavePointAsync = async ({ fn, getDb }) => {
	const db = getDb();
	const savepoint = `sp_${crypto.randomUUID()}`;

	db.exec(`SAVEPOINT "${savepoint}"`);
	try {
		const result = await fn({ db });
		db.exec(`RELEASE SAVEPOINT "${savepoint}"`);
		return result;
	} catch (error) {
		db.exec(`ROLLBACK TO SAVEPOINT "${savepoint}"`);
		throw error;
	}
};

type RunTransactionProps<T> = {
	getDb: () => DatabaseSync;
	fn: (props: { db: DatabaseSync }) => T;
};

export type RunTransaction = <T>(props: RunTransactionProps<T>) => T;

export const runTransaction: RunTransaction = ({ fn, getDb }) => {
	const db = getDb();

	db.exec("BEGIN TRANSACTION");
	try {
		const result = fn({ db });
		db.exec("COMMIT");
		return result;
	} catch (error) {
		db.exec("ROLLBACK");
		throw error;
	}
};

type RunTransactionAsyncProps<T> = {
	getDb: () => DatabaseSync;
	fn: (props: { db: DatabaseSync }) => Promise<T>;
};

export type RunTransactionAsync = <T>(props: RunTransactionAsyncProps<T>) => Promise<T>;

export const runTransactionAsync: RunTransactionAsync = async ({ fn, getDb }) => {
	const db = getDb();

	db.exec("BEGIN TRANSACTION");
	try {
		const result = await fn({ db });
		db.exec("COMMIT");
		return result;
	} catch (error) {
		db.exec("ROLLBACK");
		throw error;
	}
};
