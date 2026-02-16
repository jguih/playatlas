import type { IFileSystemServicePort, ILogServicePort } from "@playatlas/common/application";
import {
	CLASSIFICATION_IDS,
	type CanonicalClassificationThresholdTier,
	type ClassificationId,
} from "@playatlas/common/domain";
import { join } from "path";
import type { IGameRepositoryPort, IGenreRepositoryPort, ITagRepositoryPort } from "../../infra";
import type { IScoreEngineRegistryPort } from "./engine.registry";

export type IClassificationTierCalibrationServicePort = {
	generatePoliciesAsync: () => Promise<string>;
};

export type ClassificationTierCalibrationServiceDeps = {
	genreRepository: IGenreRepositoryPort;
	tagRepository: ITagRepositoryPort;
	gameRepository: IGameRepositoryPort;
	logService: ILogServicePort;
	scoreEngineRegistry: IScoreEngineRegistryPort;
	fileSystemService: IFileSystemServicePort;
};

export const makeClassificationTierCalibrationService = ({
	gameRepository,
	genreRepository,
	tagRepository,
	scoreEngineRegistry,
	fileSystemService,
}: ClassificationTierCalibrationServiceDeps): IClassificationTierCalibrationServicePort => {
	const thresholdByRank = (sorted: number[], fraction: number): number => {
		if (sorted.length === 0) {
			throw new Error("Cannot compute threshold of empty array");
		}

		const index = Math.floor((sorted.length - 1) * fraction);
		return sorted[index];
	};

	return {
		generatePoliciesAsync: async () => {
			const games = gameRepository.all({ load: true });
			const genres = genreRepository.all();
			const genresSnapshot = new Map(genres.map((g) => [g.getId(), g]));
			const tags = tagRepository.all();
			const tagsSnapshot = new Map(tags.map((t) => [t.getId(), t]));
			const classificationTiersByEngine = new Map<
				ClassificationId,
				Record<CanonicalClassificationThresholdTier, number>
			>();
			const scoresByClassification = new Map<ClassificationId, number[]>();

			for (const classificationId of CLASSIFICATION_IDS) {
				scoresByClassification.set(classificationId, []);
			}

			for (const game of games) {
				for (const classificationId of CLASSIFICATION_IDS) {
					const engine = scoreEngineRegistry.get(classificationId);

					const { normalizedScore } = engine.score({
						game,
						genresSnapshot,
						tagsSnapshot,
					});

					scoresByClassification.get(classificationId)!.push(normalizedScore);
				}
			}

			for (const classificationId of CLASSIFICATION_IDS) {
				const scores = scoresByClassification.get(classificationId)!;
				const nonZeroScores = scores.filter((s) => s > 0);
				let thresholds: Record<CanonicalClassificationThresholdTier, number>;

				if (nonZeroScores.length === 0) {
					thresholds = {
						adjacent: 0,
						strong: 0,
						core: 0,
					};
				} else {
					nonZeroScores.sort((a, b) => a - b);

					thresholds = {
						adjacent: thresholdByRank(nonZeroScores, 0.2),
						strong: thresholdByRank(nonZeroScores, 0.5),
						core: thresholdByRank(nonZeroScores, 0.8),
					};
				}

				classificationTiersByEngine.set(classificationId, thresholds);
			}

			const jsonObject = Object.fromEntries(classificationTiersByEngine);
			const json = JSON.stringify(jsonObject, null, 2);

			const destDir = join(process.cwd(), "dist");
			const destFile = join(destDir, "classification-tier-thresholds.json");

			await fileSystemService.mkdir(destDir, { mode: "0744", recursive: true });
			await fileSystemService.writeFile(destFile, json, { encoding: "utf-8", mode: "0744" });

			return destFile;
		},
	};
};
