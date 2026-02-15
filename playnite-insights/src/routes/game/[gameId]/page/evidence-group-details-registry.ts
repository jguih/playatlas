import { m } from "$lib/paraglide/messages";
import type { ClassificationId } from "@playatlas/common/domain";
import type { HorrorEvidenceGroup } from "@playatlas/game-library/application";

export type EvidenceGroupDetails = {
	name: string;
	description: string;
};

export class EvidenceGroupDetailsRegistry {
	static HORROR_ENGINE_EVIDENCE_GROUPS_DETAILS_MAP = {
		atmospheric_horror: {
			name: m["score_engine.HORROR.groups.atmospheric_horror.label"](),
			description: m["score_engine.HORROR.groups.atmospheric_horror.description"](),
		},
		combat_engagement: {
			name: m["score_engine.HORROR.groups.combat_engagement.label"](),
			description: m["score_engine.HORROR.groups.combat_engagement.description"](),
		},
		horror_identity: {
			name: m["score_engine.HORROR.groups.horror_identity.label"](),
			description: m["score_engine.HORROR.groups.horror_identity.description"](),
		},
		psychological_horror: {
			name: m["score_engine.HORROR.groups.psychological_horror.label"](),
			description: m["score_engine.HORROR.groups.psychological_horror.description"](),
		},
		resource_survival: {
			name: m["score_engine.HORROR.groups.resource_survival.label"](),
			description: m["score_engine.HORROR.groups.resource_survival.description"](),
		},
	} as const satisfies Record<HorrorEvidenceGroup, EvidenceGroupDetails>;

	static getDetailsForGroup = (
		classificationId: ClassificationId,
		groupName: string,
	): EvidenceGroupDetails | undefined => {
		switch (classificationId) {
			case "HORROR": {
				const details = EvidenceGroupDetailsRegistry.HORROR_ENGINE_EVIDENCE_GROUPS_DETAILS_MAP;
				if (Object.keys(details).includes(groupName)) {
					return details[groupName as keyof typeof details];
				}
				break;
			}
		}
	};
}
