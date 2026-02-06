import { normalize } from "@playatlas/common/common";
import type { GenreName } from "../../domain/genre.entity";
import type { IEvidenceExtractorPort } from "./scorer.ports";
import type { TaxonomySignalItem, TextSignalItem } from "./scorer.signals";
import type { Evidence } from "./scorer.types";

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
			if (Array.isArray(signal.name)) {
				if (signal.name.every(hasGenre))
					add({
						source: "taxonomy",
						sourceHint: "genre",
						match: signal.name.join(" + "),
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			} else {
				if (hasGenre(signal.name))
					add({
						source: "taxonomy",
						sourceHint: "genre",
						match: signal.name,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
			}
		}
	};

	const extractFromText = (props: {
		description?: string | null;
		add: (e: Evidence<TGroup>) => void;
	}) => {
		const { description, add } = props;
		if (!description) return 0;

		const text = normalize(description);

		for (const signal of textSignals) {
			const phrase = normalize(signal.phrase);

			if (text.includes(phrase)) {
				add({
					source: "text",
					sourceHint: "description",
					match: phrase,
					weight: signal.weight,
					group: signal.group,
					tier: signal.tier,
					isGate: signal.isGate,
				});
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
