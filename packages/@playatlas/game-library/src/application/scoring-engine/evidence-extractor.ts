import { normalize } from "@playatlas/common/common";
import { EvidenceExtractorInvalidDataError } from "../../domain";
import type { IEvidenceExtractorPort } from "./evidence-extractor.port";
import type { Evidence } from "./evidence.types";
import type { IScoreEngineDSLPort } from "./language";
import type { ScoreEnginePattern } from "./language/engine.lexicon.api";
import type {
	SignalAndGroup,
	SignalOrGroup,
	SignalTerm,
	TaxonomySignalItem,
	TextSignalItem,
} from "./language/engine.signals";

export type EvidenceExtractorDeps<TGroup> = {
	taxonomySignals: Array<TaxonomySignalItem<TGroup>>;
	textSignals: Array<TextSignalItem<TGroup>>;
	scoreEngineDSL: IScoreEngineDSLPort;
};

export const makeEvidenceExtractor = <TGroup extends string>({
	taxonomySignals,
	textSignals,
	scoreEngineDSL: DSL,
}: EvidenceExtractorDeps<TGroup>): IEvidenceExtractorPort<TGroup> => {
	const buildRegexFromPattern = (pattern: ScoreEnginePattern): RegExp => {
		const source = DSL.normalizeCompile(pattern);
		return new RegExp(source, "gi");
	};

	const extractFromTaxonomy = (props: {
		genres: string[];
		tags: string[];
		add: (e: Evidence<TGroup>) => void;
	}) => {
		const { genres, tags, add } = props;
		const genresList = genres.map(normalize);
		const tagsList = tags.map(normalize);
		const genresSet = new Set(genresList);
		const tagsSet = new Set(tagsList);

		const hasGenre = (x: SignalTerm): string | null => {
			if (typeof x === "string") {
				const normalized = normalize(x);
				return genresSet.has(normalized) ? normalized : null;
			}

			const regex = buildRegexFromPattern(x);

			for (const genre of genresList) {
				const matched = regex.exec(genre)?.at(0);
				if (matched) return matched;
			}

			return null;
		};

		const hasTag = (x: SignalTerm) => {
			if (typeof x === "string") {
				const normalized = normalize(x);
				return tagsSet.has(normalized) ? normalized : null;
			}

			const regex = buildRegexFromPattern(x);

			for (const tag of tagsList) {
				const matched = regex.exec(tag)?.at(0);
				if (matched) return matched;
			}

			return null;
		};

		const extractFromGenre = (
			signal: TaxonomySignalItem<TGroup>,
			name: SignalTerm | SignalAndGroup,
		) => {
			const genreNames = Array.isArray(name) ? name : [name];

			for (const genreName of genreNames) {
				const match = hasGenre(genreName);
				if (match)
					add({
						source: "genre",
						sourceHint: "taxonomy",
						match,
						patternExplanation: match,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			}
		};

		const extractFromTag = (
			signal: TaxonomySignalItem<TGroup>,
			name: SignalTerm | SignalAndGroup,
		) => {
			const tagNames = Array.isArray(name) ? name : [name];

			for (const tagName of tagNames) {
				const match = hasTag(tagName);
				if (match)
					add({
						source: "tag",
						sourceHint: "taxonomy",
						match,
						patternExplanation: match,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			}
		};

		for (const signal of taxonomySignals) {
			for (const name of signal.name) {
				extractFromGenre(signal, name);
				extractFromTag(signal, name);
			}
		}
	};

	const extractFromText = (props: {
		description?: string | null;
		add: (e: Evidence<TGroup>) => void;
	}) => {
		const { description, add } = props;
		if (!description) return;

		const normalizedDescription = normalize(description);

		const extractFromDescription = (
			signal: TextSignalItem<TGroup>,
			phrase: SignalOrGroup[number],
		) => {
			const phrases = Array.isArray(phrase) ? phrase : [phrase];

			for (const phrase of phrases) {
				if (typeof phrase === "string") {
					const normalized = normalize(phrase);
					if (normalizedDescription.includes(normalized)) {
						add({
							source: "text",
							sourceHint: "description",
							match: normalized,
							patternExplanation: normalized,
							weight: signal.weight,
							group: signal.group,
							tier: signal.tier,
							isGate: signal.isGate,
						});
						continue;
					}
					continue;
				}

				const regex = buildRegexFromPattern(phrase);
				const matches = regex.exec(normalizedDescription);

				if (matches) {
					for (const match of matches) {
						add({
							source: "text",
							sourceHint: "description",
							match,
							patternExplanation: DSL.normalizeExplain(phrase),
							weight: signal.weight,
							group: signal.group,
							tier: signal.tier,
							isGate: signal.isGate,
						});
					}
				}
			}
		};

		for (const signal of textSignals) {
			for (const phrase of signal.phrase) {
				extractFromDescription(signal, phrase);
			}
		}
	};

	return {
		extract: (game, { genres, tags }) => {
			const evidence: Evidence<TGroup>[] = [];
			const gameGenres: string[] = [];
			const gameTags: string[] = [];

			const add = (e: Evidence<TGroup>) => evidence.push(e);

			if (!game.relationships.genres.isLoaded() || !game.relationships.tags.isLoaded())
				throw new EvidenceExtractorInvalidDataError(
					"Evidence extractor requires all game relationships to be loaded.",
				);

			game.relationships.genres.get().forEach((gId) => {
				const genre = genres.get(gId);
				if (genre) gameGenres.push(genre.getName());
			});

			game.relationships.tags.get().forEach((tId) => {
				const tag = tags.get(tId);
				if (tag) gameTags.push(tag.getName());
			});

			extractFromTaxonomy({ genres: gameGenres, tags: gameTags, add });
			extractFromText({ description: game.getPlayniteSnapshot()?.description, add });

			return evidence;
		},
	};
};
