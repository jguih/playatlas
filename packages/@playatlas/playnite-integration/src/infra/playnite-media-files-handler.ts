import { type IFileSystemServicePort, type ILogServicePort } from "@playatlas/common/application";
import {
	InvalidFileTypeError,
	InvalidStateError,
	PlayniteGameIdParser,
} from "@playatlas/common/domain";
import type {
	GameAssetsContext,
	IGameAssetsContextFactoryPort,
} from "@playatlas/game-library/infra";
import busboy from "busboy";
import { createHash, timingSafeEqual, type Hash } from "crypto";
import { once } from "events";
import { basename, extname, join } from "path";
import sharp from "sharp";
import { Readable } from "stream";
import type { ReadableStream } from "stream/web";
import type { IPlayniteMediaFilesContextFactoryPort } from "./playnite-media-files-context.factory.port";
import { isValidFileName, MEDIA_PRESETS } from "./playnite-media-files-handler.constants";
import type { IPlayniteMediaFilesHandlerPort } from "./playnite-media-files-handler.port";
import type { PlayniteMediaFileStreamResult } from "./playnite-media-files-handler.types";

export type PlayniteMediaFilesHandlerDeps = {
	fileSystemService: IFileSystemServicePort;
	logService: ILogServicePort;
	playniteMediaFilesContextFactory: IPlayniteMediaFilesContextFactoryPort;
	gameAssetsContextFactory: IGameAssetsContextFactoryPort;
};

export const makePlayniteMediaFilesHandler = ({
	logService,
	fileSystemService,
	playniteMediaFilesContextFactory,
	gameAssetsContextFactory,
}: PlayniteMediaFilesHandlerDeps): IPlayniteMediaFilesHandlerPort => {
	const _validateImages = async (filepaths: string[]) => {
		for (const filepath of filepaths) {
			try {
				await sharp(filepath).metadata();
			} catch {
				throw new InvalidFileTypeError(`Uploaded file ${filepath} is not a valid image`);
			}
		}
	};

	const _streamFileIntoHash = async (hash: Hash, filepath: string) => {
		const stream = fileSystemService.createReadStream(filepath);

		stream.on("data", (chunk) => {
			hash.update(chunk);
		});

		await once(stream, "end");
	};

	const _deriveIconFromCover = async (
		coverPath: string,
		outputPath: string,
	): Promise<PlayniteMediaFileStreamResult> => {
		const preset = MEDIA_PRESETS.icon;
		const image = sharp(coverPath);
		const metadata = await image.metadata();

		if (!metadata.width || !metadata.height) {
			throw new Error("Invalid cover image");
		}

		const side = Math.min(metadata.width, metadata.height);

		const left = Math.floor((metadata.width - side) / 2);
		const top = Math.floor((metadata.height - side) / 2);

		await image
			.extract({
				left,
				top,
				width: side,
				height: side,
			})
			.resize(preset.w, preset.h)
			.webp({
				quality: preset.q,
				effort: 4,
				smartSubsample: true,
			})
			.toFile(outputPath);

		logService.debug(`Derived icon image from cover at ${coverPath}`);
		return {
			name: "icon",
			filename: basename(outputPath),
			filepath: outputPath,
		};
	};

	const streamMultipartToTempFolder: IPlayniteMediaFilesHandlerPort["streamMultipartToTempFolder"] =
		async (request) => {
			const bb = busboy({ headers: Object.fromEntries(request.headers) });
			const stream = Readable.fromWeb(request.body! as ReadableStream<Uint8Array>);
			const integrityHash = request.headers.get("X-ContentHash");
			const mediaContext = playniteMediaFilesContextFactory.buildContext({ integrityHash });
			let gameContext: GameAssetsContext | null = null;
			let handedContext = false;

			try {
				await mediaContext.init();

				const mediaFilesPromises: Promise<PlayniteMediaFileStreamResult>[] = [];

				await new Promise<void>((resolve, reject) => {
					let uploadCount: number = 0;

					bb.on("field", async (name, val) => {
						if (name === "gameId") {
							gameContext = gameAssetsContextFactory.buildContext(
								PlayniteGameIdParser.fromExternal(val),
							);
						}
						if (name === "contentHash") {
							gameContext?.setMediaFilesContentHash(val);
						}
					});

					bb.on("file", async (name, fileStream, { filename }) => {
						if (!isValidFileName(name)) {
							logService.warning(`Rejecting file ${filename} due to incorrect file name ${name}`);
							fileStream.resume();
							return;
						}
						const filepath = join(mediaContext.getTmpDirPath(), filename);
						logService.debug(`Saving file ${filename} to ${filepath}`);

						const filePromise = new Promise<PlayniteMediaFileStreamResult>((resolve, reject) => {
							const writeStream = fileSystemService.createWriteStream(filepath);

							writeStream.on("close", () => {
								logService.debug(`File ${filepath} saved successfully`);
								resolve({ name, filename, filepath });
							});
							writeStream.on("error", reject);

							fileStream.pipe(writeStream);
							fileStream.on("error", reject);
							fileStream.on("end", () => {
								uploadCount++;
							});
						});
						mediaFilesPromises.push(filePromise);
					});

					bb.on("finish", async () => {
						try {
							const results = await Promise.all(mediaFilesPromises);

							await _validateImages(results.map((r) => r.filepath));

							mediaContext.setStreamResults(results);
							mediaContext.validate();
							logService.info(
								`Downloaded ${uploadCount} files to temporary location ${mediaContext.getTmpDirPath()}`,
							);
							resolve();
						} catch (error) {
							reject(error);
						}
					});

					bb.on("error", reject);
					stream.on("error", reject);

					stream.pipe(bb);
				});

				if (!gameContext) {
					throw new InvalidStateError("Game assets context was null");
				}

				gameContext.validate();

				handedContext = true;
				return { mediaContext, gameContext };
			} catch (error) {
				await mediaContext.dispose();
				throw error;
			} finally {
				if (!handedContext) await mediaContext.dispose();
			}
		};

	const withMediaFilesContext: IPlayniteMediaFilesHandlerPort["withMediaFilesContext"] = async (
		request,
		cb,
	) => {
		const context = await streamMultipartToTempFolder(request);

		try {
			return await cb(context);
		} finally {
			await context.mediaContext.dispose();
		}
	};

	const verifyIntegrity: IPlayniteMediaFilesHandlerPort["verifyIntegrity"] = async ({
		mediaContext,
		gameContext,
	}) => {
		mediaContext.validate();

		const SEP = Buffer.from([0]);
		const canonicalHash = createHash("sha256");

		canonicalHash.update(Buffer.from(gameContext.getPlayniteGameId(), "utf-8"));
		canonicalHash.update(SEP);
		canonicalHash.update(Buffer.from(gameContext.getMediaFilesContentHash(), "utf-8"));
		canonicalHash.update(SEP);

		const files = [...mediaContext.getStreamResults()].sort((a, b) =>
			a.filename.localeCompare(b.filename, undefined, {
				sensitivity: "variant",
			}),
		);

		for (const { filename, filepath } of files) {
			canonicalHash.update(Buffer.from(filename, "utf-8"));
			canonicalHash.update(SEP);

			await _streamFileIntoHash(canonicalHash, filepath);
			canonicalHash.update(SEP);
		}

		const canonicalDigest = canonicalHash.digest();
		const headerDigest = mediaContext.getIntegrityHashBuffer();

		if (canonicalDigest.length !== headerDigest.length) {
			return false;
		}

		return timingSafeEqual(canonicalDigest, headerDigest);
	};

	const processImages: IPlayniteMediaFilesHandlerPort["processImages"] = async ({
		mediaContext,
	}) => {
		mediaContext.validate();

		await fileSystemService.mkdir(mediaContext.getTmpOptimizedDirPath(), {
			recursive: true,
		});

		const results = await Promise.all(
			mediaContext.getStreamResults().map(async ({ name, filepath, filename }) => {
				const preset = MEDIA_PRESETS[name];
				const outputFilename = basename(filename, extname(filename)) + ".webp";
				const outputPath = join(mediaContext.getTmpOptimizedDirPath(), outputFilename);

				return sharp(filepath, { failOn: "none" })
					.rotate()
					.resize({
						width: preset.w,
						height: preset.h,
						fit: "inside",
						withoutEnlargement: true,
					})
					.webp({
						quality: preset.q,
						effort: 4,
						smartSubsample: true,
					})
					.toFile(outputPath)
					.then(() => {
						logService.debug(
							`Optimized image ${outputPath} using preset ${JSON.stringify(preset)}`,
						);
						return {
							name,
							filename: outputFilename,
							filepath: outputPath,
						} as PlayniteMediaFileStreamResult;
					});
			}),
		);

		const cover = results.find((r) => r.name === "cover");
		if (!results.find((r) => r.name === "icon") && cover) {
			const outputPath = join(mediaContext.getTmpOptimizedDirPath(), `${crypto.randomUUID()}.webp`);
			const result = await _deriveIconFromCover(cover.filepath, outputPath);
			results.push(result);
		}

		return results;
	};

	const moveProcessedImagesToGameFolder: IPlayniteMediaFilesHandlerPort["moveProcessedImagesToGameFolder"] =
		async ({ mediaContext, gameContext }) => {
			mediaContext.validate();

			await gameContext.ensureMediaFilesDirAsync({ cleanup: true });

			logService.debug(
				`Moving files from ${mediaContext.getTmpOptimizedDirPath()} to ${gameContext.getMediaFilesDirPath()}`,
			);

			await fileSystemService.rename(
				mediaContext.getTmpOptimizedDirPath(),
				gameContext.getMediaFilesDirPath(),
			);

			logService.debug(
				`Moved temporary files at ${mediaContext.getTmpOptimizedDirPath()} to game media files location ${gameContext.getMediaFilesDirPath()}`,
			);
		};

	const writeContentHashFileToGameFolder: IPlayniteMediaFilesHandlerPort["writeContentHashFileToGameFolder"] =
		async ({ mediaContext, gameContext }) => {
			mediaContext.validate();

			await gameContext.ensureMediaFilesDirAsync();
			await gameContext.writeMediaFilesContentHashAsync();
		};

	return {
		streamMultipartToTempFolder,
		withMediaFilesContext,
		verifyIntegrity,
		processImages,
		moveProcessedImagesToGameFolder,
		writeContentHashFileToGameFolder,
	};
};
