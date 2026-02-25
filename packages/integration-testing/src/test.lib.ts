import {
	makeTestCompositionRoot,
	type TestCompositionRootDeps,
} from "@playatlas/bootstrap/testing";
import type { DomainEvent } from "@playatlas/common/application";
import type { SyncCursor } from "@playatlas/common/infra";
import { api } from "./vitest.global.setup";

export const buildTestCompositionRoot = (props: Omit<TestCompositionRootDeps, "env"> = {}) =>
	makeTestCompositionRoot({
		...props,
		env: {
			PLAYATLAS_LOG_LEVEL: process.env.PLAYATLAS_LOG_LEVEL,
			PLAYATLAS_MIGRATIONS_DIR: process.env.PLAYATLAS_MIGRATIONS_DIR,
			PLAYATLAS_USE_IN_MEMORY_DB: process.env.PLAYATLAS_USE_IN_MEMORY_DB,
			PLAYATLAS_DATA_DIR: process.env.PLAYATLAS_DATA_DIR,
		},
	});

export const recordDomainEvents = () => {
	const events: DomainEvent[] = [];
	const unsubscribe = api.getEventBus().subscribe((event) => events.push(event));
	return { events, unsubscribe };
};

export const isCursorAfter = (a: SyncCursor, b: SyncCursor): boolean => {
	if (a.lastUpdatedAt.getTime() !== b.lastUpdatedAt.getTime()) {
		return a.lastUpdatedAt > b.lastUpdatedAt;
	}

	return a.id > b.id;
};

export const isCursorEqual = (a: SyncCursor, b: SyncCursor): boolean => {
	return a.lastUpdatedAt.getTime() === b.lastUpdatedAt.getTime() && a.id === b.id;
};
