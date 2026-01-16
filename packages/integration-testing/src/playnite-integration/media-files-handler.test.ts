import { faker } from "@faker-js/faker";
import {
	CONTENT_HASH_FILE_NAME,
	MEDIA_PRESETS,
	type ValidMediaFileFieldName,
} from "@playatlas/playnite-integration/infra";
import { type Hash, createHash } from "crypto";
import { once } from "events";
import { createReadStream, openAsBlob } from "fs";
import * as fsAsync from "fs/promises";
import { extname, join } from "path";
import sharp from "sharp";
import { beforeEach, describe, expect, it } from "vitest";
import { api, factory, fixturesDirPath, root } from "../vitest.global.setup";

const placeholdersDirPath = join(fixturesDirPath, "/images", "/placeholder");
const images: Array<{
	name: ValidMediaFileFieldName;
	filename: string;
	filepath: string;
}> = [
	{
		name: "background",
		filename: "background.png",
		filepath: join(placeholdersDirPath, "background.png"),
	},
	{
		name: "cover",
		filename: "cover.png",
		filepath: join(placeholdersDirPath, "cover.png"),
	},
	{
		name: "icon",
		filename: "icon.png",
		filepath: join(placeholdersDirPath, "icon.png"),
	},
];

const buildFormData = async (
	props: { gameId?: string; contentHash?: string } = {},
): Promise<FormData> => {
	const formData = new FormData();
	const gameId = props.gameId ?? faker.string.uuid();
	const contentHash = props.contentHash ?? faker.string.uuid();
	formData.set("gameId", gameId);
	formData.set("contentHash", contentHash);
	for (const { name, filename, filepath } of images) {
		const blob = await openAsBlob(filepath);
		formData.set(name, blob, filename);
	}
	return formData;
};

const buildRequest = (formData: FormData): Request => {
	const request = new Request("https://playatlas-test.com/api/extension/sync/files", {
		method: "POST",
		body: formData,
	});
	return request;
};

const streamFileIntoHash = async (hash: Hash, filepath: string) => {
	const stream = createReadStream(filepath);
	stream.on("data", (chunk) => hash.update(chunk));
	await once(stream, "end");
};

const buildCanonicalHashBase64 = async (props: { gameId: string; contentHash: string }) => {
	const SEP = Buffer.from([0]);
	const canonicalHash = createHash("sha256");

	canonicalHash.update(Buffer.from(props.gameId, "utf-8"));
	canonicalHash.update(SEP);
	canonicalHash.update(Buffer.from(props.contentHash, "utf-8"));
	canonicalHash.update(SEP);

	const files = [...images].sort((a, b) =>
		a.filename.localeCompare(b.filename, undefined, {
			sensitivity: "variant",
		}),
	);

	for (const { filename, filepath } of files) {
		canonicalHash.update(Buffer.from(filename, "utf-8"));
		canonicalHash.update(SEP);

		await streamFileIntoHash(canonicalHash, filepath);
		canonicalHash.update(SEP);
	}

	const canonicalDigestBase64 = canonicalHash.digest("base64");
	return canonicalDigestBase64;
};

describe("Playnite Integration / Media Files Handler", () => {
	beforeEach(async () => {
		const dir = api.system.getSystemConfig().getLibFilesDir();
		const entries = await fsAsync.readdir(dir, { withFileTypes: true });

		await Promise.all(
			entries.map((entry) => {
				api.getLogService().warning(`Deleting ${join(entry.parentPath, entry.name)}`);
				return fsAsync.rm(join(dir, entry.name), {
					recursive: true,
					force: true,
				});
			}),
		);
	});

	it("streams files to temporary dir", async () => {
		// Arrange
		const formData = await buildFormData();
		const request = buildRequest(formData);
		// Act
		await api.playniteIntegration
			.getPlayniteMediaFilesHandler()
			.withMediaFilesContext(request, async (context) => {
				// Assert
				expect(context.getStreamResults()).toHaveLength(3);
				for (const result of context.getStreamResults()) {
					const stats = await fsAsync.stat(result.filepath);
					expect(stats.isFile()).toBe(true);
				}
			});
	});

	it("verifies integrity for canonical media payload", async () => {
		// Arrange
		const gameId = faker.string.uuid();
		const contentHash = faker.string.uuid();
		const formData = await buildFormData({ gameId, contentHash });
		const canonicalDigestBase64 = await buildCanonicalHashBase64({
			gameId,
			contentHash,
		});
		const request = buildRequest(formData);
		request.headers.set("X-ContentHash", canonicalDigestBase64);

		await api.playniteIntegration
			.getPlayniteMediaFilesHandler()
			.withMediaFilesContext(request, async (context) => {
				// Act
				const isValid = await api.playniteIntegration
					.getPlayniteMediaFilesHandler()
					.verifyIntegrity(context);
				// Assert
				expect(isValid).toBe(true);
			});
	});

	it("optimizes uploaded images", async () => {
		// Arrange
		const gameId = faker.string.uuid();
		const contentHash = faker.string.uuid();
		const formData = await buildFormData({ gameId, contentHash });
		const canonicalDigestBase64 = await buildCanonicalHashBase64({
			gameId,
			contentHash,
		});
		const request = buildRequest(formData);
		request.headers.set("X-ContentHash", canonicalDigestBase64);
		const handler = api.playniteIntegration.getPlayniteMediaFilesHandler();

		await handler.withMediaFilesContext(request, async (context) => {
			// Act
			const isValid = await handler.verifyIntegrity(context);
			const optimizedResults = await handler.processImages(context);
			// Assert
			expect(isValid).toBe(true);
			for (const { filepath, name } of optimizedResults) {
				const preset = MEDIA_PRESETS[name];
				const stats = await fsAsync.stat(filepath);
				const ext = extname(filepath);
				const metadata = await sharp(filepath).metadata();

				expect(stats.isFile()).toBe(true);
				expect(filepath).toContain(join(context.getTmpDirPath(), "optimized"));
				expect(ext).toBe(".webp");
				expect(metadata.format).toBe("webp");
				expect(metadata.width).toBeLessThanOrEqual(preset.w);
				expect(metadata.height).toBeLessThanOrEqual(preset.h);
			}
			expect(optimizedResults).toHaveLength(context.getStreamResults().length);
		});
	});

	it("moves optimized images to game folder", async () => {
		// Arrange
		const gameId = faker.string.uuid();
		const contentHash = faker.string.uuid();
		const formData = await buildFormData({ gameId, contentHash });
		const canonicalDigestBase64 = await buildCanonicalHashBase64({
			gameId,
			contentHash,
		});
		const request = buildRequest(formData);
		request.headers.set("X-ContentHash", canonicalDigestBase64);
		const handler = api.playniteIntegration.getPlayniteMediaFilesHandler();

		await handler.withMediaFilesContext(request, async (context) => {
			// Act
			const isValid = await handler.verifyIntegrity(context);
			await handler.processImages(context);
			await handler.moveProcessedImagesToGameFolder(context);
			const gameFolder = join(api.system.getSystemConfig().getLibFilesDir(), context.getGameId());
			const stats = await fsAsync.stat(gameFolder);
			const fileEntries = await fsAsync.readdir(gameFolder, {
				withFileTypes: true,
			});
			// Assert
			expect(isValid).toBe(true);
			expect(stats.isDirectory()).toBe(true);
			expect(fileEntries).toHaveLength(context.getStreamResults().length);
			for (const entry of fileEntries) {
				expect(entry.isFile()).toBe(true);
				const filepath = join(entry.parentPath, entry.name);
				const ext = extname(entry.name);
				const metadata = await sharp(filepath).metadata();
				expect(ext).toBe(".webp");
				expect(metadata.format).toBe("webp");
			}
		});
	});

	it("writes content hash file", async () => {
		// Arrange
		const gameId = faker.string.uuid();
		const contentHash = faker.string.uuid();
		const formData = await buildFormData({ gameId, contentHash });
		const canonicalDigestBase64 = await buildCanonicalHashBase64({
			gameId,
			contentHash,
		});
		const request = buildRequest(formData);
		request.headers.set("X-ContentHash", canonicalDigestBase64);
		const handler = api.playniteIntegration.getPlayniteMediaFilesHandler();
		let matchedOnce = false;

		await handler.withMediaFilesContext(request, async (context) => {
			// Act
			const isValid = await handler.verifyIntegrity(context);
			await handler.writeContentHashFileToGameFolder(context);
			const stats = await fsAsync.stat(context.getGameDirPath());
			const fileEntries = await fsAsync.readdir(context.getGameDirPath(), {
				withFileTypes: true,
			});
			// Assert
			expect(isValid).toBe(true);
			expect(stats.isDirectory()).toBe(true);
			for (const entry of fileEntries) {
				expect(entry.isFile()).toBe(true);
				if (entry.name.match(/contentHash/i)) {
					expect(entry.name).toBe(CONTENT_HASH_FILE_NAME);
					matchedOnce = true;
				}
			}
			expect(matchedOnce).toBe(true);
		});
	});

	it("synchronizes game images from request", async () => {
		// Arrange
		const game = factory.getGameFactory().build();
		game.setPlayniteSnapshot({
			...game.getPlayniteSnapshot(),
			backgroundImage: null,
			coverImage: null,
			icon: null,
		});
		root.seedGame(game);

		const gameFolder = join(api.system.getSystemConfig().getLibFilesDir(), game.getId());
		const gameId = game.getId();
		const contentHash = game.getContentHash();
		const formData = await buildFormData({ gameId, contentHash });
		const canonicalDigestBase64 = await buildCanonicalHashBase64({
			gameId,
			contentHash,
		});
		let wroteContentHash = false;
		const request = buildRequest(formData);
		request.headers.set("X-ContentHash", canonicalDigestBase64);
		const service = api.playniteIntegration.getPlayniteSyncService();

		// Act
		const result = await service.handleMediaFilesSynchronizationRequest(request);
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const queryGames = queryResult.type === "ok" ? queryResult.data : [];
		const updatedGame = queryGames.find((g) => g.Id === game.getPlayniteSnapshot().id);

		// Assert
		expect(result.success).toBeTruthy();
		expect(updatedGame).toBeDefined();
		const fileEntries = await fsAsync.readdir(gameFolder, {
			withFileTypes: true,
		});
		for (const entry of fileEntries) {
			if (entry.name.match(/contentHash/i)) {
				wroteContentHash = true;
				continue;
			}
			expect(entry.isFile()).toBe(true);
			const filepath = join(entry.parentPath, entry.name);
			const ext = extname(entry.name);
			const metadata = await sharp(filepath).metadata();
			expect(ext).toBe(".webp");
			expect(metadata.format).toBe("webp");
		}
		expect(updatedGame!.Assets.BackgroundImagePath).not.toBe(null);
		expect(updatedGame!.Assets.CoverImagePath).not.toBe(null);
		expect(updatedGame!.Assets.IconImagePath).not.toBe(null);
		expect(wroteContentHash).toBe(true);
	});
});
