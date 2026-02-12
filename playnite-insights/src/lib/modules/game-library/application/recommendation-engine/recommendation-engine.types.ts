import type { GameId } from "$lib/modules/common/domain";

export type RecommendationEngineFilterProps = { gameId: GameId; vector: Float32Array };

export type RecommendationEngineFilter = (props: RecommendationEngineFilterProps) => boolean;
