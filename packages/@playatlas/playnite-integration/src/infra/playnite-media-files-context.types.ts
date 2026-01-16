import type { IFileSystemServicePort, ILogServicePort } from "@playatlas/common/application";
import { type GameImageType } from "@playatlas/common/common";
import type { ISystemConfigPort } from "@playatlas/common/infra";
import type { PlayniteMediaFileStreamResult } from "./playnite-media-files-handler.types";

export type MakePlayniteMediaFilesContextDeps = {
	fileSystemService: IFileSystemServicePort;
	logService: ILogServicePort;
	systemConfig: ISystemConfigPort;
};

export type MakePlayniteMediaFilesContextProps = {
	integrityHash: string | null;
	contentHash?: string;
	streamResults?: PlayniteMediaFileStreamResult[];
};

export type ValidMediaFileFieldName = GameImageType;
