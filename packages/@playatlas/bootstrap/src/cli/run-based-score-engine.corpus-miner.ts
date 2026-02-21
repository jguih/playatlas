import "dotenv/config";
import { join } from "path";
import { buildPlayAtlasApiAsync } from "./lib/build-api";

async function main() {
	const { api } = await buildPlayAtlasApiAsync();

	api.getLogService().info(`Extracting data from Run-based engine corpus`);

	const corpusPath = join(import.meta.dirname, "input/score-engine/corpus");
	const positiveCorpusPath = join(corpusPath, "run-based");
	const negativeCorpusPath = join(corpusPath, "horror");

	await api.gameLibrary.scoreEngine
		.getScoreEngineCorpusMiner()
		.mineCorpusAsync({ positiveCorpusPath, negativeCorpusPath });

	api.getLogService().success(`Extraction successful`);

	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
