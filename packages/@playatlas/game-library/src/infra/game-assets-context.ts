import {
	validation,
	type IFileSystemServicePort,
	type ILogServicePort,
} from "@playatlas/common/application";
import { CONTENT_HASH_FILE_NAME } from "@playatlas/common/common";
import { InvalidStateError, type PlayniteGameId } from "@playatlas/common/domain";
import type { ISystemConfigPort } from "@playatlas/common/infra";
import { join } from "path";

export type GameAssetsContext = Readonly<{
	getPlayniteGameId: () => PlayniteGameId;
	getMediaFilesDirPath: () => string;
	getMediaFilesContentHash: () => string;
	setMediaFilesContentHash: (value: string) => void;
	getMediaFilesContentHashFilePath: () => string;
	writeMediaFilesContentHashAsync: () => Promise<void>;
	readMediaFilesContentHashAsync: () => Promise<Buffer>;
	ensureMediaFilesDirAsync: (props?: { cleanup?: boolean }) => Promise<void>;
	validate: () => void;
}>;

export type GameAssetsContextDeps = {
	playniteGameId: PlayniteGameId;
	systemConfig: ISystemConfigPort;
	fileSystemService: IFileSystemServicePort;
	logService: ILogServicePort;
};

export const makeGameAssetsContext = ({
	playniteGameId,
	systemConfig,
	fileSystemService,
	logService,
}: GameAssetsContextDeps) => {
	const _media_files_dir = join(systemConfig.getMediaFilesRootDirPath(), playniteGameId);
	const _media_files_content_hash_file_path = join(_media_files_dir, CONTENT_HASH_FILE_NAME);
	let _media_files_content_hash: string | null = null;

	const _getMediaFilesContentHash = () => {
		if (!_media_files_content_hash)
			throw new InvalidStateError("Media files content hash is not set.");
		if (validation.isNullOrEmptyString(_media_files_content_hash))
			throw new InvalidStateError(
				validation.message.isNullOrEmptyString("Media files content hash"),
			);
		return _media_files_content_hash;
	};

	const _validate = () => {
		if (_media_files_content_hash && validation.isEmptyString(_media_files_content_hash))
			throw new InvalidStateError(
				validation.message.isNullOrEmptyString("Media files content hash"),
			);
	};

	_validate();

	const context: GameAssetsContext = {
		getPlayniteGameId: () => playniteGameId,
		getMediaFilesDirPath: () => _media_files_dir,
		getMediaFilesContentHashFilePath: () => _media_files_content_hash_file_path,
		getMediaFilesContentHash: _getMediaFilesContentHash,
		setMediaFilesContentHash: (value) => {
			_media_files_content_hash = value;
			_validate();
		},
		readMediaFilesContentHashAsync: async () => {
			return await fileSystemService.readfile(_media_files_content_hash_file_path);
		},
		writeMediaFilesContentHashAsync: async () => {
			const hash = _getMediaFilesContentHash();
			await fileSystemService.writeFile(_media_files_content_hash_file_path, hash, "utf-8");
		},
		ensureMediaFilesDirAsync: async ({ cleanup } = {}) => {
			const createGameDir = async () =>
				await fileSystemService.mkdir(_media_files_dir, {
					recursive: true,
					mode: "0744",
				});
			try {
				await fileSystemService.access(_media_files_dir);
				if (cleanup) {
					await fileSystemService.rm(_media_files_dir, {
						force: true,
						recursive: true,
					});
					await createGameDir();
				}
			} catch {
				await createGameDir();
			} finally {
				logService.debug(`Created game media folder at ${_media_files_dir}`);
			}
		},
		validate: _validate,
	};

	return Object.freeze(context);
};
