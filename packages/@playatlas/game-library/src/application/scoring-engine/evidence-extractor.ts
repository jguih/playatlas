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
		return new RegExp(source, "i");
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

		const hasGenre = (x: SignalTerm) => {
			if (typeof x === "string") {
				return genresSet.has(normalize(x));
			}
			const regex = buildRegexFromPattern(x);
			return genresList.some((g) => regex.test(g));
		};

		const hasTag = (x: SignalTerm) => {
			if (typeof x === "string") {
				return tagsSet.has(normalize(x));
			}
			const regex = buildRegexFromPattern(x);
			return tagsList.some((g) => regex.test(g));
		};

		const extractFromGenre = (
			signal: TaxonomySignalItem<TGroup>,
			name: SignalTerm | SignalAndGroup,
		) => {
			if (Array.isArray(name)) {
				if (name.every((n) => hasGenre(n)))
					add({
						source: "genre",
						sourceHint: "taxonomy",
						match: name.map((n) => (typeof n === "string" ? n : DSL.explain(n))).join(" + "),
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			} else if (hasGenre(name)) {
				add({
					source: "genre",
					sourceHint: "taxonomy",
					match: typeof name === "string" ? name : DSL.explain(name),
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
			if (Array.isArray(name)) {
				if (name.every((n) => hasTag(n)))
					add({
						source: "tag",
						sourceHint: "taxonomy",
						match: name.map((n) => (typeof n === "string" ? n : DSL.explain(n))).join(" + "),
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			} else if (hasTag(name)) {
				add({
					source: "tag",
					sourceHint: "taxonomy",
					match: typeof name === "string" ? name : DSL.explain(name),
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
			if (Array.isArray(phrase)) {
				const match = phrase.every((p) => {
					if (typeof p === "string") {
						return normalizedDescription.includes(normalize(p));
					}
					const regex = buildRegexFromPattern(p);
					return regex.test(normalizedDescription);
				});

				if (match)
					add({
						source: "text",
						sourceHint: "description",
						match: phrase.map((p) => (typeof p === "string" ? p : DSL.explain(p))).join(" + "),
						weight: signal.weight,
						group: signal.group,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			} else {
				let match = false;

				if (typeof phrase === "string") {
					match = normalizedDescription.includes(normalize(phrase));
				} else {
					const regex = buildRegexFromPattern(phrase);
					match = regex.test(normalizedDescription);
				}

				if (match)
					add({
						source: "text",
						sourceHint: "description",
						match: typeof phrase === "string" ? phrase : DSL.explain(phrase),
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
