import { ISODateSchema } from "@playatlas/common/common";
import { playniteGameIdSchema } from "@playatlas/common/domain";
import z from "zod";

export const playniteProjectionResponseDtoSchema = z.object({
	Id: playniteGameIdSchema,
	Name: z.string().nullable(),
	Description: z.string().nullable(),
	ReleaseDate: z.string().nullable(),
	Playtime: z.number(),
	LastActivity: z.string().nullable(),
	Added: z.string().nullable(),
	InstallDirectory: z.string().nullable(),
	IsInstalled: z.number(),
	Hidden: z.number(),
	CompletionStatusId: z.string().nullable(),
	ContentHash: z.string(),
	Developers: z.array(z.string()),
	Publishers: z.array(z.string()),
	Genres: z.array(z.string()),
	Platforms: z.array(z.string()),
	Assets: z.object({
		BackgroundImagePath: z.string().nullable(),
		CoverImagePath: z.string().nullable(),
		IconImagePath: z.string().nullable(),
	}),
	Sync: z.object({
		LastUpdatedAt: ISODateSchema.nullable(),
		DeletedAt: ISODateSchema.nullable(),
		DeleteAfter: ISODateSchema.nullable(),
	}),
});

export type PlayniteProjectionResponseDto = z.infer<typeof playniteProjectionResponseDtoSchema>;
