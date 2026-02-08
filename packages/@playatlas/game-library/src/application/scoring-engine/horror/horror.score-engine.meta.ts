import type { ClassificationGroupPolicy } from "../engine.policy";
import type { TaxonomySignalItem, TextSignalItem } from "../engine.signals";
import type { ScoreEngineVersion } from "../score-engine.types";

export const HORROR_ENGINE_VERSION = "v1.0.0" as const satisfies ScoreEngineVersion;

export const HORROR_ENGINE_EVIDENCE_GROUPS = [
	"core_horror",
	"survival_horror",
	"psychological_horror",
	"cosmic_horror",
	"atmospheric_horror",
] as const satisfies string[];

export type HorrorEvidenceGroup = (typeof HORROR_ENGINE_EVIDENCE_GROUPS)[number];

export const HORROR_ENGINE_GROUP_POLICY: ClassificationGroupPolicy<HorrorEvidenceGroup> = {
	core_horror: { cap: 45 },
	survival_horror: { cap: 55 },
	psychological_horror: { cap: 55 },
	atmospheric_horror: { cap: 30 },
	cosmic_horror: { cap: 25 },
};

export const HORROR_ENGINE_TEXT_SIGNALS = [
	// Tier A: explicit genre labeling
	{
		phrase: "psychological horror",
		weight: 60,
		group: "psychological_horror",
		tier: "A",
		isGate: true,
	},
	{ phrase: "survival horror", weight: 45, group: "survival_horror", tier: "A", isGate: true },
	{ phrase: "cosmic horror", weight: 45, group: "cosmic_horror", tier: "A", isGate: true },
	{ phrase: "horror game", weight: 35, group: "core_horror", tier: "A", isGate: true },
	{ phrase: "horror adventure", weight: 35, group: "core_horror", tier: "A", isGate: true },
	{ phrase: "adventure horror", weight: 35, group: "core_horror", tier: "A", isGate: true },
	// Tier B: atmospheric horror
	{ phrase: "creeping dread", weight: 25, group: "atmospheric_horror", tier: "B", isGate: true },
	{ phrase: "dread", weight: 25, group: "atmospheric_horror", tier: "B", isGate: false },
	{ phrase: "eerie", weight: 20, group: "atmospheric_horror", tier: "B", isGate: false },
	{ phrase: "sinister", weight: 20, group: "atmospheric_horror", tier: "B", isGate: false },
	{ phrase: "haunting", weight: 20, group: "atmospheric_horror", tier: "B", isGate: false },
	// Tier B: psychological horror
	{ phrase: "disturbing", weight: 20, group: "psychological_horror", tier: "B", isGate: false },
	// Tier B: body/cosmic horror flavor
	{ phrase: "grotesque", weight: 20, group: "cosmic_horror", tier: "B", isGate: false },
	{ phrase: "macabre", weight: 20, group: "cosmic_horror", tier: "B", isGate: false },
	// Tier C: flavor words
	{ phrase: "terrifying", weight: 15, group: "atmospheric_horror", tier: "C", isGate: false },
	{ phrase: "unsettling", weight: 12, group: "atmospheric_horror", tier: "C", isGate: false },
	{ phrase: "nightmare", weight: 12, group: "psychological_horror", tier: "C", isGate: false },
	{ phrase: "nightmarish", weight: 12, group: "psychological_horror", tier: "C", isGate: false },
] as const satisfies Array<TextSignalItem<HorrorEvidenceGroup>>;

export const HORROR_ENGINE_TAXONOMY_SIGNALS = [
	// Tier A: authoritative genre metadata
	{ name: "horror", weight: 55, group: "core_horror", tier: "A", isGate: true },
	{ name: "terror", weight: 55, group: "core_horror", tier: "A", isGate: true },
	{ name: "survival horror", weight: 55, group: "survival_horror", tier: "A", isGate: true },
	{ name: ["horror", "survival"], weight: 55, group: "survival_horror", tier: "A", isGate: true },
	{
		name: "psychological horror",
		weight: 60,
		group: "psychological_horror",
		tier: "A",
		isGate: true,
	},
	{
		name: ["psychological", "horror"],
		weight: 60,
		group: "psychological_horror",
		tier: "A",
		isGate: true,
	},
	// Tier B: weak standalone signals
	{ name: "survival", weight: 8, group: "survival_horror", tier: "B", isGate: false },
] as const satisfies Array<TaxonomySignalItem<HorrorEvidenceGroup>>;
