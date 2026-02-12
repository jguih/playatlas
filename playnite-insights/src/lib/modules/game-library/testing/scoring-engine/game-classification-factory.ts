import { GameClassificationIdParser, GameIdParser } from "$lib/modules/common/domain";
import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import { CLASSIFICATION_IDS, type ClassificationId } from "@playatlas/common/domain";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";
import { ClientTestFactory } from "../client-test-factory";

export type IGameClassificationFactoryPort = IClientEntityFactoryPort<GameClassification>;

export class GameClassificationFactory
	extends ClientTestFactory
	implements IGameClassificationFactoryPort
{
	private buildGameClassification = (): GameClassification => {
		const Score = faker.number.int({ min: 0, max: 100 });

		return {
			Id: GameClassificationIdParser.fromTrusted(faker.string.ulid()),
			SourceLastUpdatedAt: faker.date.recent(),
			DeletedAt: null,
			DeleteAfter: null,
			GameId: GameIdParser.fromTrusted(faker.string.ulid()),
			ClassificationId: this.pickOne(CLASSIFICATION_IDS) as unknown as ClassificationId,
			Breakdown: { type: "raw", payload: {} },
			Score,
			NormalizedScore: 0.15 + (Score / 100) * 0.85,
			ScoreMode: "without_gate",
			Sync: {
				ErrorMessage: null,
				LastSyncedAt: faker.date.recent(),
				Status: "synced",
			},
		};
	};

	build: IGameClassificationFactoryPort["build"] = () => {
		return this.buildGameClassification();
	};

	buildList: IGameClassificationFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildGameClassification());
	};
}
