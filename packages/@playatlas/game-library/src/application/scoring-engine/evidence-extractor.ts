import { normalize } from "@playatlas/common/common";
import type { GenreName } from "../../domain/genre.entity";
import type { TaxonomySignalItem, TextSignalItem } from "./engine.signals";
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
		genres: GenreName[];
		add: (e: Evidence<TGroup>) => void;
	}) => {
		const { genres, add } = props;
		const normalizedGenres = genres.map(normalize);

		const hasGenre = (x: string) => normalizedGenres.includes(x);

		for (const signal of taxonomySignals) {
			const names = Array.isArray(signal.name) ? signal.name : [signal.name];

			if (names.every(hasGenre))
				add({
					source: "taxonomy",
					sourceHint: "genre",
					match: names.join(" + "),
					group: signal.group,
					weight: signal.weight,
					tier: signal.tier,
					isGate: signal.isGate,
				});
		}
	};

	const extractFromText = (props: {
		description?: string | null;
		add: (e: Evidence<TGroup>) => void;
	}) => {
		const { description, add } = props;
		if (!description) return 0;

		const normalizedDescription = normalize(description);

		for (const signal of textSignals) {
			const phrases = Array.isArray(signal.phrase) ? signal.phrase : [signal.phrase];

			for (const phrase of phrases) {
				const normalizedPhrase = normalize(phrase);
				if (normalizedDescription.includes(normalizedPhrase)) {
					add({
						source: "text",
						sourceHint: "description",
						match: normalizedPhrase,
						weight: signal.weight,
						group: signal.group,
						tier: signal.tier,
						isGate: signal.isGate,
					});
				}
			}
		}
	};

	return {
		extract: (game, { genres }) => {
			const evidence: Evidence<TGroup>[] = [];
			const gameGenres: GenreName[] = [];

			const add = (e: Evidence<TGroup>) => evidence.push(e);

			if (game.relationships.genres.isLoaded())
				game.relationships.genres.get().forEach((gId) => {
					const genre = genres.get(gId);
					if (genre) gameGenres.push(genre.getName());
				});

			extractFromTaxonomy({ genres: gameGenres, add });
			extractFromText({ description: game.getPlayniteSnapshot()?.description, add });

			return evidence;
		},
	};
};
