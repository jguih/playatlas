import type { IFileSystemServicePort, ILogServicePort } from "@playatlas/common/application";
import {
	CLASSIFICATION_IDS,
	type CanonicalClassificationThresholdTier,
	type ClassificationId,
	type EvidenceGroupThresholdTier,
} from "@playatlas/common/domain";
import { join } from "path";
import type { IGameRepositoryPort, IGenreRepositoryPort, ITagRepositoryPort } from "../../infra";
import type { IScoreEngineRegistryPort } from "./engines/engine.registry";

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
				{
					thresholds: Record<CanonicalClassificationThresholdTier, number>;
					groups: Record<string, Record<EvidenceGroupThresholdTier, number>>;
				}
			>();
			const scoresByClassification = new Map<ClassificationId, number[]>();
			const scoresByGroup = new Map<ClassificationId, Map<string, number[]>>();

			for (const classificationId of CLASSIFICATION_IDS) {
				classificationTiersByEngine.set(classificationId, {
					thresholds: { adjacent: 0, core: 0, strong: 0 },
					groups: {},
				});
				scoresByClassification.set(classificationId, []);
				scoresByGroup.set(classificationId, new Map());
			}

			for (const game of games) {
				for (const classificationId of CLASSIFICATION_IDS) {
					const engine = scoreEngineRegistry.get(classificationId);

					const { normalizedScore, breakdown } = engine.score({
						game,
						genresSnapshot,
						tagsSnapshot,
					});

					scoresByClassification.get(classificationId)!.push(normalizedScore);

					for (const group of breakdown.groups) {
						let groupScores = scoresByGroup.get(classificationId)!.get(group.group);
						if (!groupScores) {
							groupScores = [];
							scoresByGroup.get(classificationId)!.set(group.group, groupScores);
						}
						groupScores.push(group.normalizedContribution);
					}
				}
			}

			for (const classificationId of CLASSIFICATION_IDS) {
				const scores = scoresByClassification.get(classificationId)!;
				const nonZeroScores = scores.filter((s) => s > 0);
				const engineTiers = classificationTiersByEngine.get(classificationId)!;
				const groupScores = scoresByGroup.get(classificationId)!;

				if (nonZeroScores.length === 0) {
					engineTiers.thresholds = {
						adjacent: 0,
						strong: 0,
						core: 0,
					};
				} else {
					nonZeroScores.sort((a, b) => a - b);

					engineTiers.thresholds = {
						adjacent: thresholdByRank(nonZeroScores, 0.2),
						strong: thresholdByRank(nonZeroScores, 0.5),
						core: thresholdByRank(nonZeroScores, 0.8),
					};
				}

				for (const [groupName, scores] of groupScores) {
					const nonZeroGroupScores = scores.filter((s) => s > 0);

					if (nonZeroGroupScores.length === 0) {
						engineTiers.groups[groupName] = {
							moderate: 0,
							strong: 0,
						};
					} else {
						nonZeroGroupScores.sort((a, b) => a - b);

						engineTiers.groups[groupName] = {
							moderate: thresholdByRank(nonZeroGroupScores, 0.5),
							strong: thresholdByRank(nonZeroGroupScores, 0.8),
						};
					}
				}
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
