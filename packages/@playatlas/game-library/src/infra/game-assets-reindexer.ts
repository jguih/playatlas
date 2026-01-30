import type { IFileSystemServicePort, ILogServicePort } from "@playatlas/common/application";
import { CONTENT_HASH_FILE_NAME, type GameImageType } from "@playatlas/common/common";
import path, { basename } from "path";
import sharp from "sharp";
import type { PlayniteGameSnapshot } from "../domain";
import type { Game } from "../domain/game.entity";
import type { IGameAssetsContextFactoryPort } from "./game-assets-context.factory.port";
import type { IGameAssetsReindexerPort } from "./game-assets-reindexer.port";
import type { IGameRepositoryPort } from "./game.repository.port";

export type GameAssetsReindexerDeps = {
	gameRepository: IGameRepositoryPort;
	gameAssetsContextFactory: IGameAssetsContextFactoryPort;
	fileSystemService: IFileSystemServicePort;
	logService: ILogServicePort;
};

export const makeGameAssetsReindexer = ({
	gameRepository,
	gameAssetsContextFactory,
	fileSystemService,
	logService,
}: GameAssetsReindexerDeps): IGameAssetsReindexerPort => {
	const isImageTypeInFilename = (filename: string, type: GameImageType) => filename.includes(type);

	const computeImageType = (filepath: string): GameImageType => {
		const filename = basename(filepath);
		if (isImageTypeInFilename(filename, "icon")) return "icon";
		if (isImageTypeInFilename(filename, "cover")) return "cover";
		return "background";
	};

	const processGameImage = async ({
		filepath,
		playniteSnapshot,
		game,
	}: {
		filepath: string;
		playniteSnapshot: PlayniteGameSnapshot;
		game: Game;
	}): Promise<boolean> => {
		try {
			await fileSystemService.access(filepath);
		} catch {
			logService.debug(`Image file not found: ${filepath}`);
			return false;
		}

		const { width, height } = await sharp(filepath).metadata();
		const imageType = computeImageType(filepath);
		logService.debug(
			`Found image at ${filepath} for ${playniteSnapshot.name} (width: ${width}, height: ${height}, computed type: ${imageType})`,
		);

		game.setImageReference({ name: imageType, path: { filename: basename(filepath) } });
		return true;
	};

	const reindexGameAssetsAsync: IGameAssetsReindexerPort["reindexGameAssetsAsync"] = async () => {
		const games = gameRepository.all();
		const updatedGames: Game[] = [];
		let updatedImageReferences = 0;

		logService.info(`Reindexing images for ${games.length} games`);

		for (const game of games) {
			const playniteSnapshot = game.getPlayniteSnapshot();
			const gameDescription = `(Id: ${game.getId()}, Name: ${playniteSnapshot?.name})`;

			if (!playniteSnapshot) {
				logService.debug(`Skipping game (${gameDescription}) due to missing Playnite snapshot`);
				continue;
			}

			const playniteGameId = playniteSnapshot.id;
			const context = gameAssetsContextFactory.buildContext(playniteGameId);
			const mediaFolder = context.getMediaFilesDirPath();

			try {
				await fileSystemService.access(mediaFolder);
			} catch {
				logService.debug(`Skipping game ${gameDescription} due to missing media folder`);
				continue;
			}

			const entries = await fileSystemService.readdir(mediaFolder);

			for (const entry of entries) {
				if (entry.toLowerCase() === CONTENT_HASH_FILE_NAME.toLowerCase()) {
					continue;
				}
				const filepath = path.join(mediaFolder, entry);

				try {
					const didUpdate = await processGameImage({ filepath, game, playniteSnapshot });
					if (didUpdate) updatedImageReferences++;
				} catch {
					logService.debug(`Failed processing image at ${filepath}`);
					continue;
				}
			}

			if (updatedImageReferences > 0) {
				logService.debug(
					`Will update ${updatedImageReferences} image references for ${gameDescription}`,
				);
				updatedGames.push(game);
			} else {
				logService.debug(`No image reference updated for ${gameDescription}`);
			}
		}

		gameRepository.upsert(updatedGames);
	};

	return {
		reindexGameAssetsAsync,
	};
};
