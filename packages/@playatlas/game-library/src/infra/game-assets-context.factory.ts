import type { IFileSystemServicePort, ILogServiceFactoryPort } from "@playatlas/common/application";
import type { ISystemConfigPort } from "@playatlas/common/infra";
import { makeGameAssetsContext } from "./game-assets-context";
import type { IGameAssetsContextFactoryPort } from "./game-assets-context.factory.port";

export type GameAssetsContextFactoryDeps = {
	logServiceFactory: ILogServiceFactoryPort;
	systemConfig: ISystemConfigPort;
	fileSystemService: IFileSystemServicePort;
};

export const makeGameAssetsContextFactory = ({
	fileSystemService,
	logServiceFactory,
	systemConfig,
}: GameAssetsContextFactoryDeps): IGameAssetsContextFactoryPort => {
	return {
		buildContext: (playniteGameId) => {
			return makeGameAssetsContext({
				playniteGameId,
				fileSystemService,
				systemConfig,
				logService: logServiceFactory.build("GameAssetsContext"),
			});
		},
	};
};
