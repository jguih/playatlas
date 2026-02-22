import { normalize } from "@playatlas/common/common";
import { EvidenceExtractorInvalidDataError } from "../../domain";
import type { IEvidenceExtractorPort } from "./evidence-extractor.port";
import type { Evidence } from "./evidence.types";
import type { IScoreEngineDSLPort } from "./language";
import type { ScoreEnginePattern } from "./language/engine.lexicon.api";
import type {
	ExpandedTaxonomySignalItem,
	ExpandedTextSignalItem,
	SignalAndGroup,
	SignalOrGroup,
	SignalTerm,
} from "./language/engine.signals";

export type EvidenceExtractorDeps<TGroup> = {
	taxonomySignals: Array<ExpandedTaxonomySignalItem<TGroup>>;
	textSignals: Array<ExpandedTextSignalItem<TGroup>>;
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

		const extractFromGenre = (
			signal: ExpandedTaxonomySignalItem<TGroup>,
			name: SignalTerm | SignalAndGroup,
		) => {
			if (Array.isArray(name)) {
				const matches: Array<{ match: string; patternExplanation: string }> = [];

				const match = name.every((n) => {
					if (typeof n === "string") {
						const normalized = normalize(n);
						if (genresSet.has(normalized)) {
							matches.push({
								match: normalized,
								patternExplanation: `genre list contains literal string '${normalized}'`,
							});
							return true;
						}
					} else {
						const regex = buildRegexFromPattern(n);
						let matched = false;

						for (const genre of genresList) {
							for (const match of genre.matchAll(regex)) {
								matches.push({ match: match[0], patternExplanation: DSL.normalizeExplain(n) });
								matched = true;
							}
						}

						return matched;
					}
				});

				if (match)
					add({
						source: "genre",
						sourceHint: "taxonomy",
						match: matches.map((m) => m.match).join(" + "),
						patternExplanation: matches.map((m) => m.patternExplanation).join(" + "),
						signalId: signal.signalId,
						lang: signal.language,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});

				return;
			}

			if (typeof name === "string") {
				const normalized = normalize(name);
				if (genresSet.has(normalized)) {
					add({
						source: "genre",
						sourceHint: "taxonomy",
						match: normalized,
						patternExplanation: `genre list contains literal string '${normalized}'`,
						signalId: signal.signalId,
						lang: signal.language,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
				}
				return;
			}

			const regex = buildRegexFromPattern(name);

			for (const genre of genresList) {
				for (const match of genre.matchAll(regex)) {
					add({
						source: "genre",
						sourceHint: "taxonomy",
						match: match[0],
						index: match.index,
						patternExplanation: DSL.normalizeExplain(name),
						signalId: signal.signalId,
						lang: signal.language,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
				}
			}
		};

		const extractFromTag = (
			signal: ExpandedTaxonomySignalItem<TGroup>,
			name: SignalTerm | SignalAndGroup,
		) => {
			if (Array.isArray(name)) {
				const matches: Array<{ match: string; patternExplanation: string }> = [];

				const match = name.every((n) => {
					if (typeof n === "string") {
						const normalized = normalize(n);
						if (tagsSet.has(normalized)) {
							matches.push({
								match: normalized,
								patternExplanation: `tag list contains literal string '${normalized}'`,
							});
							return true;
						}
					} else {
						const regex = buildRegexFromPattern(n);
						let matched = false;

						for (const tag of tagsList) {
							for (const match of tag.matchAll(regex)) {
								matches.push({ match: match[0], patternExplanation: DSL.normalizeExplain(n) });
								matched = true;
							}
						}

						return matched;
					}
				});

				if (match)
					add({
						source: "tag",
						sourceHint: "taxonomy",
						match: matches.map((m) => m.match).join(" + "),
						patternExplanation: matches.map((m) => m.patternExplanation).join(" + "),
						signalId: signal.signalId,
						lang: signal.language,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});

				return;
			}

			if (typeof name === "string") {
				const normalized = normalize(name);
				if (tagsSet.has(normalized)) {
					add({
						source: "tag",
						sourceHint: "taxonomy",
						match: normalized,
						patternExplanation: `tag list contains literal string '${normalized}'`,
						signalId: signal.signalId,
						lang: signal.language,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
				}
				return;
			}

			const regex = buildRegexFromPattern(name);

			for (const tag of tagsList) {
				for (const match of tag.matchAll(regex)) {
					add({
						source: "tag",
						sourceHint: "taxonomy",
						match: match[0],
						index: match.index,
						patternExplanation: DSL.normalizeExplain(name),
						signalId: signal.signalId,
						lang: signal.language,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
				}
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
			signal: ExpandedTextSignalItem<TGroup>,
			phrase: SignalOrGroup[number],
		) => {
			if (Array.isArray(phrase)) {
				const matches: Array<{ match: string; patternExplanation: string }> = [];

				const match = phrase.every((p) => {
					if (typeof p === "string") {
						const normalized = normalize(p);
						if (normalizedDescription.includes(normalized)) {
							matches.push({
								match: normalized,
								patternExplanation: `description contains literal string '${normalized}'`,
							});
							return true;
						}
					} else {
						const regex = buildRegexFromPattern(p);
						let matched = false;

						for (const match of normalizedDescription.matchAll(regex)) {
							matches.push({
								match: match[0],
								patternExplanation: DSL.normalizeExplain(p),
							});
							matched = true;
						}

						return matched;
					}
				});

				if (match) {
					add({
						source: "text",
						sourceHint: "description",
						match: matches.map((m) => m.match).join(" + "),
						patternExplanation: matches.map((m) => m.patternExplanation).join(" + "),
						signalId: signal.signalId,
						lang: signal.language,
						weight: signal.weight,
						group: signal.group,
						tier: signal.tier,
						isGate: signal.isGate,
					});
				}

				return;
			}

			if (typeof phrase === "string") {
				const normalized = normalize(phrase);
				if (normalizedDescription.includes(normalized)) {
					add({
						source: "text",
						sourceHint: "description",
						match: normalized,
						patternExplanation: `description contains literal string '${normalized}'`,
						signalId: signal.signalId,
						lang: signal.language,
						weight: signal.weight,
						group: signal.group,
						tier: signal.tier,
						isGate: signal.isGate,
					});
				}
				return;
			}

			const regex = buildRegexFromPattern(phrase);

			for (const match of normalizedDescription.matchAll(regex)) {
				add({
					source: "text",
					sourceHint: "description",
					match: match[0],
					index: match.index,
					patternExplanation: DSL.normalizeExplain(phrase),
					signalId: signal.signalId,
					lang: signal.language,
					weight: signal.weight,
					group: signal.group,
					tier: signal.tier,
					isGate: signal.isGate,
				});
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
