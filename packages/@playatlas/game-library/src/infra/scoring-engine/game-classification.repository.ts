import { ISODateSchema } from "@playatlas/common/common";
import { gameClassificationIdSchema, gameIdSchema } from "@playatlas/common/domain";
import z from "zod";
import { classificationIdSchema } from "../../domain";

export const gameClassificationSchema = z.object({
	Id: gameClassificationIdSchema,
	GameId: gameIdSchema,
	ClassificationId: classificationIdSchema,
	EngineVersion: z.string().min(1),
	BreakdownJson: z.string().min(1),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type GameClassificationModel = z.infer<typeof gameClassificationSchema>;
