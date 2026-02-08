import type { EvidenceTier } from "@playatlas/common/domain";

type TextSignalItemBaseProps<TGroup> = {
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	isGate: boolean;
};

export type TextSignalItem<TGroup> = TextSignalItemBaseProps<TGroup> & {
	phrase: string | string[];
};

export type TextSignalItemNoPhrase<TGroup> = TextSignalItemBaseProps<TGroup>;

type TaxonomySignalItemBaseProps<TGroup> = {
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	isGate: boolean;
};

export type TaxonomySignalItem<TGroup> = TaxonomySignalItemBaseProps<TGroup> & {
	name: string | string[];
};

export type TaxonomySignalItemNoName<TGroup> = TaxonomySignalItemBaseProps<TGroup>;
