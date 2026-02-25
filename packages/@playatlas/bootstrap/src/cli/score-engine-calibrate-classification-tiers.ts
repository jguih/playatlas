import "dotenv/config";
import { buildPlayAtlasApiAsync } from "./lib/build-api";

async function main() {
	const { api } = await buildPlayAtlasApiAsync();

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
