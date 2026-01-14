import type { IFileSystemServicePort, ILogServicePort } from "@playatlas/common/application";
import { type GameImageType } from "@playatlas/common/common";
import type { SystemConfig } from "@playatlas/system/infra";
import type { PlayniteMediaFileStreamResult } from "./playnite-media-files-handler.types";

export type MakePlayniteMediaFilesContextDeps = {
	fileSystemService: IFileSystemServicePort;
	logService: ILogServicePort;
	systemConfig: SystemConfig;
};

export type MakePlayniteMediaFilesContextProps = {
	contentHashHeader: string | null;
	gameId?: string;
	contentHash?: string;
	streamResults?: PlayniteMediaFileStreamResult[];
};

export type ValidMediaFileFieldName = GameImageType;
