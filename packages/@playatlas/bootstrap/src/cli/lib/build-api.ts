import { makeAppCompositionRoot } from "../../application";

export const buildPlayAtlasApiAsync = async () => {
	const env = {
		PLAYATLAS_LOG_LEVEL: process.env.PLAYATLAS_LOG_LEVEL,
		PLAYATLAS_MIGRATIONS_DIR: process.env.PLAYATLAS_MIGRATIONS_DIR,
		PLAYATLAS_USE_IN_MEMORY_DB: process.env.PLAYATLAS_USE_IN_MEMORY_DB,
		PLAYATLAS_DATA_DIR: process.env.PLAYATLAS_DATA_DIR,
	};

	const root = makeAppCompositionRoot({ env });
	const api = await root.buildAsync();

	return { root, api };
};
