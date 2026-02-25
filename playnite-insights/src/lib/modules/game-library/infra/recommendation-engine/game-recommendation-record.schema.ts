import type { ClientRepositoryMeta, IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GameRecommendationRecordReadModel } from "./game-recommendation-record.readonly-store";

export const gameRecommendationRecordStoreMeta = {
	storeName: "game-recommendation-record",
	index: {},
} as const satisfies ClientRepositoryMeta<string, string>;

export type GameRecommendationRecordStoreIndex =
	(typeof gameRecommendationRecordStoreMeta.index)[keyof typeof gameRecommendationRecordStoreMeta.index];

export const gameRecommendationRecordStoreSchema: IIndexedDbSchema = {
	define: ({ db }) => {
		const { storeName } = gameRecommendationRecordStoreMeta;

		if (!db.objectStoreNames.contains(storeName)) {
			const keyPath: (keyof GameRecommendationRecordReadModel)[] = ["GameId"];
			db.createObjectStore(storeName, { keyPath });
		}
	},
};
