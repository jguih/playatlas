import "dotenv/config";
import { makeAppCompositionRoot } from "../application/app-composition-root";

async function main() {
	const env = {
		PLAYATLAS_LOG_LEVEL: process.env.PLAYATLAS_LOG_LEVEL,
		PLAYATLAS_MIGRATIONS_DIR: process.env.PLAYATLAS_MIGRATIONS_DIR,
		PLAYATLAS_USE_IN_MEMORY_DB: process.env.PLAYATLAS_USE_IN_MEMORY_DB,
		PLAYATLAS_DATA_DIR: process.env.PLAYATLAS_DATA_DIR,
	};

	const root = makeAppCompositionRoot({ env });
	const api = await root.buildAsync();

	api.getLogService().info(`Generating classification tier calibration metadata...`);
	const destFile = await api.gameLibrary.scoreEngine
		.getClassificationTierCalibrationService()
		.generatePoliciesAsync();
	api
		.getLogService()
		.success(`Classification calibration metadata generated at ${destFile} successfully`);

	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
