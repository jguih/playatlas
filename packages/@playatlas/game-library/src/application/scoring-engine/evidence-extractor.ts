import { normalize } from "@playatlas/common/common";
import { EvidenceExtractorInvalidDataError } from "../../domain";
import type { GenreName } from "../../domain/genre.entity";
import type { SignalOrGroup, TaxonomySignalItem, TextSignalItem } from "./engine.signals";
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

		const hasGenre = (x: string) => normalizedGenres.includes(normalize(x));

		for (const signal of taxonomySignals) {
			for (const name of signal.name) {
				if (Array.isArray(name)) {
					if (name.every(hasGenre))
						add({
							source: "taxonomy",
							sourceHint: "genre",
							match: name.join(" + "),
							group: signal.group,
							weight: signal.weight,
							tier: signal.tier,
							isGate: signal.isGate,
						});
				} else if (hasGenre(name)) {
					add({
						source: "taxonomy",
						sourceHint: "genre",
						match: name,
						group: signal.group,
						weight: signal.weight,
						tier: signal.tier,
						isGate: signal.isGate,
					});
				}
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

		const handleSignal = (signal: TextSignalItem<TGroup>, phrase: SignalOrGroup[number]) => {
			if (Array.isArray(phrase)) {
				const normalized = phrase.map(normalize);
				if (normalized.every(normalizedDescription.includes))
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
				handleSignal(signal, phrase);
			}
		}
	};

	return {
		extract: (game, { genres }) => {
			const evidence: Evidence<TGroup>[] = [];
			const gameGenres: GenreName[] = [];

			const add = (e: Evidence<TGroup>) => evidence.push(e);

			if (!game.relationships.genres.isLoaded())
				throw new EvidenceExtractorInvalidDataError(
					"Evidence extractor requires all game relationships to be loaded.",
				);

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
