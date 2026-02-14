import { normalize } from "@playatlas/common/common";
import { EvidenceExtractorInvalidDataError } from "../../domain";
import type {
	SignalAndGroup,
	SignalOrGroup,
	TaxonomySignalItem,
	TextSignalItem,
} from "./engine.signals";
import type { IEvidenceExtractorPort } from "./evidence-extractor.port";
import type { Evidence } from "./evidence.types";

export type EvidenceExtractorDeps<TGroup> = {
	taxonomySignals: Array<TaxonomySignalItem<TGroup>>;
	textSignals: Array<TextSignalItem<TGroup>>;
};

export const makeEvidenceExtractor = <TGroup extends string>({
	taxonomySignals,
	textSignals,
}: EvidenceExtractorDeps<TGroup>): IEvidenceExtractorPort<TGroup> => {
	const extractFromTaxonomy = (props: {
		genres: string[];
		tags: string[];
		add: (e: Evidence<TGroup>) => void;
	}) => {
		const { genres, tags, add } = props;
		const genresList = genres.map(normalize);
		const tagsList = tags.map(normalize);

		const hasGenre = (x: string) => genresList.includes(normalize(x));
		const hasTag = (x: string) => tagsList.includes(normalize(x));

		const extractFromGenre = (
			signal: TaxonomySignalItem<TGroup>,
			name: string | SignalAndGroup,
		) => {
			if (Array.isArray(name)) {
				if (name.every((n) => hasGenre(n)))
					add({
						source: "genre",
						sourceHint: "taxonomy",
						match: name.join(" + "),
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			} else if (hasGenre(name)) {
				add({
					source: "genre",
					sourceHint: "taxonomy",
					match: name,
					group: signal.group,
					weight: signal.weight,
					tier: signal.tier,
					isGate: signal.isGate,
				});
			}
		};

		const extractFromTag = (signal: TaxonomySignalItem<TGroup>, name: string | SignalAndGroup) => {
			if (Array.isArray(name)) {
				if (name.every((n) => hasTag(n)))
					add({
						source: "tag",
						sourceHint: "taxonomy",
						match: name.join(" + "),
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			} else if (hasTag(name)) {
				add({
					source: "tag",
					sourceHint: "taxonomy",
					match: name,
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
				const normalized = phrase.map(normalize);
				if (normalized.every((p) => normalizedDescription.includes(p)))
					add({
						source: "text",
						sourceHint: "description",
						match: normalized.join(" + "),
						weight: signal.weight,
						group: signal.group,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			} else {
				const normalized = normalize(phrase);
				if (normalizedDescription.includes(normalized))
					add({
						source: "text",
						sourceHint: "description",
						match: normalized,
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
