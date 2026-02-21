import type { IFileSystemServicePort, ILogServicePort } from "@playatlas/common/application";
import { normalize } from "@playatlas/common/common";
import { join } from "path";

export type IScoreEngineCorpusMinerPort = {
	mineCorpusAsync: (props: {
		positiveCorpusPath: string | string[];
		negativeCorpusPath: string | string[];
	}) => Promise<void>;
};

export type ScoreEngineCorpusMinerDeps = {
	fileSystemService: IFileSystemServicePort;
	logService: ILogServicePort;
};

export const makeScoreEngineCorpusMiner = ({
	fileSystemService: fs,
	logService,
}: ScoreEngineCorpusMinerDeps): IScoreEngineCorpusMinerPort => {
	const loadCorpusAsync = async (dirs: string[]): Promise<string[]> => {
		const corpus: string[] = [];

		for (const dir of dirs) {
			logService.debug(`Loading corpus at ${dir}`);
			const entries = await fs.readdir(dir);
			logService.debug(`Found ${entries.length} entries`);
			await Promise.allSettled(
				entries.map(async (file) => {
					const content = await fs.readfile(join(dir, file), "utf-8");
					corpus.push(normalize(content));
				}),
			);
		}

		return corpus;
	};

	const getNgrams = (tokens: string[], n: number): string[] => {
		const result = [];
		for (let i = 0; i <= tokens.length - n; i++) {
			result.push(tokens.slice(i, i + n).join(" "));
		}
		return result;
	};

	const countPhrases = (texts: string[], n: number) => {
		const counts = new Map<string, number>();

		for (const text of texts) {
			const tokens = text.split(/\s+/).filter((t) => t.length > 2);
			const ngrams = new Set(getNgrams(tokens, n));

			for (const phrase of ngrams) {
				counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
			}
		}

		return counts;
	};

	return {
		mineCorpusAsync: async ({ positiveCorpusPath, negativeCorpusPath }) => {
			const positiveCorpusPaths = Array.isArray(positiveCorpusPath)
				? positiveCorpusPath
				: [positiveCorpusPath];
			const negativeCorpusPaths = Array.isArray(negativeCorpusPath)
				? negativeCorpusPath
				: [negativeCorpusPath];

			const positiveTexts = await loadCorpusAsync(positiveCorpusPaths);
			const negativeTexts = await loadCorpusAsync(negativeCorpusPaths);

			const totalPositive = positiveTexts.length;
			const totalNegative = negativeTexts.length;

			const positiveCounts = new Map([
				...countPhrases(positiveTexts, 3).entries(),
				...countPhrases(positiveTexts, 2).entries(),
			]);
			const negativeCounts = new Map([
				...countPhrases(negativeTexts, 3).entries(),
				...countPhrases(negativeTexts, 2).entries(),
			]);

			const scored = [];

			for (const [phrase, posCount] of positiveCounts.entries()) {
				const negCount = negativeCounts.get(phrase) ?? 0;

				if (posCount < 3) continue;

				const score = posCount / totalPositive / ((negCount + 1) / totalNegative);

				scored.push({ phrase, posCount, negCount, score });
			}

			scored.sort((a, b) => b.score - a.score);

			console.table(scored.slice(0, 50));
		},
	};
};
