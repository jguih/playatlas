import type { IFileSystemServicePort, ILogServiceFactoryPort } from "@playatlas/common/application";
import type { ISystemConfigPort } from "@playatlas/common/infra";
import { makePlayniteMediaFilesContext } from "./playnite-media-files-context";
import type { IPlayniteMediaFilesContextFactoryPort } from "./playnite-media-files-context.factory.port";

export type PlayniteMediaFilesContextFactoryDeps = {
	logServiceFactory: ILogServiceFactoryPort;
	fileSystemService: IFileSystemServicePort;
	systemConfig: ISystemConfigPort;
};

export const makePlayniteMediaFilesContextFactory = (
	deps: PlayniteMediaFilesContextFactoryDeps,
): IPlayniteMediaFilesContextFactoryPort => {
	return {
		buildContext: (props) => {
			return makePlayniteMediaFilesContext(
				{ ...deps, logService: deps.logServiceFactory.build("PlayniteMediaFilesContext") },
				props,
			);
		},
	};
};
