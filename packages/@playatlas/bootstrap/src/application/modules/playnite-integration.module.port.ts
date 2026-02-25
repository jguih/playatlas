import type {
	ILibraryManifestServicePort,
	IPlayniteSyncServicePort,
} from "@playatlas/playnite-integration/application";
import type { ISyncGamesCommandHandlerPort } from "@playatlas/playnite-integration/commands";
import type {
	IPlayniteMediaFilesContextFactoryPort,
	IPlayniteMediaFilesHandlerPort,
} from "@playatlas/playnite-integration/infra";

export type IPlayniteIntegrationModulePort = Readonly<{
	getPlayniteMediaFilesHandler: () => IPlayniteMediaFilesHandlerPort;
	getLibraryManifestService: () => ILibraryManifestServicePort;
	getPlayniteSyncService: () => IPlayniteSyncServicePort;
	commands: {
		getSyncGamesCommandHandler: () => ISyncGamesCommandHandlerPort;
	};
	getPlayniteMediaFilesContextFactory: () => IPlayniteMediaFilesContextFactoryPort;
}>;
