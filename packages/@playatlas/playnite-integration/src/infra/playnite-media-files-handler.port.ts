import type { GameAssetsContext } from "@playatlas/game-library/infra";
import type { PlayniteMediaFilesContext } from "./playnite-media-files-context";
import type { PlayniteMediaFileStreamResult } from "./playnite-media-files-handler.types";

export type PlayniteMediaFilesHandlerContext = {
	mediaContext: PlayniteMediaFilesContext;
	gameContext: GameAssetsContext;
};

export type IPlayniteMediaFilesHandlerPort = {
	/**
	 * Streams the request's multipart form data to a temporary location using busboy.
	 *
	 * IMPORTANT: caller owns the context and MUST call `dispose()`.
	 */
	streamMultipartToTempFolder: (request: Request) => Promise<PlayniteMediaFilesHandlerContext>;
	/**
	 * Scoped helper that guarantees context disposal.
	 * Preferred API for most use cases.
	 */
	withMediaFilesContext: <T>(
		request: Request,
		cb: (context: PlayniteMediaFilesHandlerContext) => Promise<T>,
	) => Promise<T>;
	verifyIntegrity: (context: PlayniteMediaFilesHandlerContext) => Promise<boolean>;
	/**
	 * Process images using sharp.
	 * @param imageFilePaths Array of image paths for process
	 */
	processImages: (
		context: PlayniteMediaFilesHandlerContext,
	) => Promise<PlayniteMediaFileStreamResult[]>;
	moveProcessedImagesToGameFolder: (context: PlayniteMediaFilesHandlerContext) => Promise<void>;
	writeContentHashFileToGameFolder: (context: PlayniteMediaFilesHandlerContext) => Promise<void>;
};
