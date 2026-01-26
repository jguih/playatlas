import { MEDIA_PRESETS } from "@playatlas/playnite-integration/infra";
import * as fsAsync from "fs/promises";
import { extname, join } from "path";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	MediaFilesSyncTestEnvironmentBuilder,
	type MediaFilesSyncTestEnvironment,
} from "../test-lib/environments/media-files-sync.test-env";
import { api, root } from "../vitest.global.setup";

describe("Playnite Integration / Media Files Handler", () => {
	const envBuilder = new MediaFilesSyncTestEnvironmentBuilder();
	let env: MediaFilesSyncTestEnvironment;

	beforeEach(async () => {
		root.seedGameRelationships();
		env = await envBuilder.buildAsync();
	});

	afterEach(async () => {
		await env.cleanupAsync();
	});

	it("streams files to temporary dir", async () => {
		// Arrange
		const { request } = env;

		// Act
		await api.playniteIntegration
			.getPlayniteMediaFilesHandler()
			.withMediaFilesContext(request, async ({ mediaContext }) => {
				const tmpDir = mediaContext.getTmpDirPath();

				// Assert
				expect(mediaContext.getStreamResults()).toHaveLength(3);
				for (const result of mediaContext.getStreamResults()) {
					const stats = await fsAsync.stat(result.filepath);
					expect(stats.isFile()).toBe(true);
					expect(result.filepath.startsWith(tmpDir)).toBe(true);
				}
			});
	});

	it("cleans up temp directory on context disposal", async () => {
		const { request } = env;

		let tmpDir: string;

		await api.playniteIntegration
			.getPlayniteMediaFilesHandler()
			.withMediaFilesContext(request, async ({ mediaContext }) => {
				tmpDir = mediaContext.getTmpDirPath();
			});

		await expect(fsAsync.stat(tmpDir!)).rejects.toThrow();
	});

	it("verifies integrity for canonical media payload", async () => {
		// Arrange
		const { request } = env;

		const handler = api.playniteIntegration.getPlayniteMediaFilesHandler();

		await handler.withMediaFilesContext(request, async (context) => {
			// Act
			const isValid = await handler.verifyIntegrity(context);
			// Assert
			expect(isValid).toBe(true);
		});
	});

	it("optimizes uploaded images", async () => {
		// Arrange
		const { request } = env;
		const handler = api.playniteIntegration.getPlayniteMediaFilesHandler();

		await handler.withMediaFilesContext(request, async (context) => {
			const { mediaContext } = context;

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
				expect(filepath.startsWith(mediaContext.getTmpOptimizedDirPath())).toBe(true);
				expect(ext).toBe(".webp");
				expect(metadata.format).toBe("webp");
				expect(metadata.width).toBeLessThanOrEqual(preset.w);
				expect(metadata.height).toBeLessThanOrEqual(preset.h);
			}
			expect(optimizedResults).toHaveLength(mediaContext.getStreamResults().length);
		});
	});

	it("moves optimized images to game folder", async () => {
		// Arrange
		const { request } = env;
		const handler = api.playniteIntegration.getPlayniteMediaFilesHandler();

		await handler.withMediaFilesContext(request, async (context) => {
			const { mediaContext, gameContext } = context;

			// Act
			const isValid = await handler.verifyIntegrity(context);
			await handler.processImages(context);
			await handler.moveProcessedImagesToGameFolder(context);

			const gameFolder = gameContext.getMediaFilesDirPath();
			const stats = await fsAsync.stat(gameFolder);
			const fileEntries = await fsAsync.readdir(gameFolder, {
				withFileTypes: true,
			});

			// Assert
			expect(isValid).toBe(true);
			expect(stats.isDirectory()).toBe(true);
			expect(fileEntries).toHaveLength(mediaContext.getStreamResults().length);
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
		const { request } = env;
		const handler = api.playniteIntegration.getPlayniteMediaFilesHandler();

		await handler.withMediaFilesContext(request, async (context) => {
			const { gameContext } = context;

			// Assert pre-condition: content hash file not written yet
			await expect(
				fsAsync.access(gameContext.getMediaFilesContentHashFilePath()),
			).rejects.toThrow();

			// Act
			await handler.writeContentHashFileToGameFolder(context);
			const contentHash = gameContext.getMediaFilesContentHash();
			const contentHashBuffer = Buffer.from(contentHash, "utf-8");

			// Assert
			await expect(
				fsAsync.access(gameContext.getMediaFilesContentHashFilePath()),
			).resolves.toBeUndefined();
			expect(await gameContext.readMediaFilesContentHashAsync()).toEqual(contentHashBuffer);
		});
	});

	it("synchronizes game images from request", async () => {
		// Arrange
		const { request, gameContext } = env;

		// Act
		const result = await api.playniteIntegration
			.getPlayniteSyncService()
			.handleMediaFilesSynchronizationRequest(request);
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = queryResult.data;
		const updatedGame = games.find((g) => g.Id === gameContext.getPlayniteGameId());

		const fileEntries = await fsAsync.readdir(gameContext.getMediaFilesDirPath(), {
			withFileTypes: true,
		});

		// Assert
		expect(result.success).toBeTruthy();

		await expect(
			fsAsync.access(gameContext.getMediaFilesContentHashFilePath()),
		).resolves.toBeUndefined();

		const filenames: string[] = [];
		for (const entry of fileEntries) {
			if (entry.name.match(/contentHash/i)) continue;

			const filepath = join(entry.parentPath, entry.name);
			const ext = extname(entry.name);
			const metadata = await sharp(filepath).metadata();

			expect(entry.isFile()).toBe(true);
			expect(ext).toBe(".webp");
			expect(metadata.format).toBe("webp");

			filenames.push(entry.name);
		}

		expect(updatedGame!.Assets.BackgroundImagePath).not.toBe(null);
		expect(updatedGame?.Assets.BackgroundImagePath).toMatch(
			new RegExp(`^${gameContext.getPlayniteGameId()}/`),
		);
		expect(updatedGame!.Assets.BackgroundImagePath).toMatch(/\.webp$/);
		const backgroundPath = join(
			api.system.getSystemConfig().getMediaFilesRootDirPath(),
			updatedGame!.Assets.BackgroundImagePath!,
		);
		await expect(fsAsync.access(backgroundPath)).resolves.toBeUndefined();

		expect(updatedGame!.Assets.CoverImagePath).not.toBe(null);
		expect(updatedGame?.Assets.CoverImagePath).toMatch(
			new RegExp(`^${gameContext.getPlayniteGameId()}/`),
		);
		expect(updatedGame!.Assets.CoverImagePath).toMatch(/\.webp$/);
		const coverPath = join(
			api.system.getSystemConfig().getMediaFilesRootDirPath(),
			updatedGame!.Assets.CoverImagePath!,
		);
		await expect(fsAsync.access(coverPath)).resolves.toBeUndefined();

		expect(updatedGame!.Assets.IconImagePath).not.toBe(null);
		expect(updatedGame?.Assets.IconImagePath).toMatch(
			new RegExp(`^${gameContext.getPlayniteGameId()}/`),
		);
		expect(updatedGame!.Assets.IconImagePath).toMatch(/\.webp$/);
		const iconPath = join(
			api.system.getSystemConfig().getMediaFilesRootDirPath(),
			updatedGame!.Assets.IconImagePath!,
		);
		await expect(fsAsync.access(iconPath)).resolves.toBeUndefined();
	});
});
