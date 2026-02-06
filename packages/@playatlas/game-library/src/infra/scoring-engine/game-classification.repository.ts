import { ISODateSchema } from "@playatlas/common/common";
import { gameIdSchema } from "@playatlas/common/domain";
import z from "zod";
import { classificationIdSchema } from "../../domain";

export const gameClassificationSchema = z.object({
	GameId: gameIdSchema,
	ClassificationId: classificationIdSchema,
	EngineVersion: z.string().min(1),
	BreakdownJson: z.string().min(1),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
});

export type GameClassificationModel = z.infer<typeof gameClassificationSchema>;
