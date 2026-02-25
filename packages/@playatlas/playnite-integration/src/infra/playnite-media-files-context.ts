import { validation } from "@playatlas/common/application";
import { InvalidStateError, type DisposableAsync } from "@playatlas/common/domain";
import { join } from "path";
import type {
	MakePlayniteMediaFilesContextDeps,
	MakePlayniteMediaFilesContextProps,
} from "./playnite-media-files-context.types";
import { type PlayniteMediaFileStreamResult } from "./playnite-media-files-handler.types";

export type PlayniteMediaFilesContextId = string;
export type PlayniteMediaFilesContext = DisposableAsync & {
	getIntegrityHash: () => string;
	getIntegrityHashBuffer: () => Buffer;
	getStreamResults: () => PlayniteMediaFileStreamResult[];
	setStreamResults: (value: PlayniteMediaFileStreamResult[]) => void;
	getTmpDirPath: () => string;
	getTmpOptimizedDirPath: () => string;
	validate: () => void;
	/**
	 * Creates the resources required by this context
	 */
	init: () => Promise<void>;
};

export const makePlayniteMediaFilesContext = (
	{ fileSystemService, logService, systemConfig }: MakePlayniteMediaFilesContextDeps,
	props: MakePlayniteMediaFilesContextProps,
): PlayniteMediaFilesContext => {
	const _context_id = crypto.randomUUID();
	const _tmp_dir_path = join(systemConfig.getTmpDir(), _context_id);
	const _tmp_optimized_dir_path = join(_tmp_dir_path, "/optimized");

	const _integrity_hash = props.integrityHash ?? null;
	let _stream_results: PlayniteMediaFileStreamResult[] = props.streamResults ?? [];
	let _decoded_integrity_hash: Buffer | null = null;
	let initialized: boolean = false;

	const _validate = () => {
		if (!_integrity_hash) throw new InvalidStateError("Content hash is not set.");
		if (validation.isEmptyString(_integrity_hash))
			throw new InvalidStateError(validation.message.isEmptyString("ContentHash"));

		try {
			_decoded_integrity_hash = Buffer.from(_integrity_hash, "base64");
		} catch {
			throw new InvalidStateError(`Integrity hash is not valid base64`);
		}

		if (
			_decoded_integrity_hash.length === 0 ||
			_decoded_integrity_hash.toString("base64") !== _integrity_hash
		) {
			throw new InvalidStateError(`Integrity hash is not valid base64`);
		}

		if (_decoded_integrity_hash.length !== 32) {
			throw new InvalidStateError(`Integrity hash must decode to 32 bytes`);
		}
	};

	_validate();

	const context: PlayniteMediaFilesContext = {
		getIntegrityHash: () => {
			if (!_integrity_hash) throw new InvalidStateError("Integrity hash is not set");
			return _integrity_hash;
		},
		getIntegrityHashBuffer: () => {
			if (!_decoded_integrity_hash)
				throw new InvalidStateError("Decoded integrity hash is not defined");
			return _decoded_integrity_hash;
		},
		getStreamResults: () => _stream_results,
		setStreamResults: (value) => (_stream_results = value),
		getTmpDirPath: () => _tmp_dir_path,
		getTmpOptimizedDirPath: () => _tmp_optimized_dir_path,
		validate: () => {
			if (!initialized) throw new InvalidStateError("Context not initialized.");
			_validate();
		},
		dispose: async () => {
			logService.debug(`Disposing Playnite media files context ${_context_id}`);
			await fileSystemService.rm(_tmp_dir_path, { recursive: true, force: true });
			logService.debug(`Deleted temporary folder at ${_tmp_dir_path}.`);
		},
		init: async () => {
			logService.debug(`Initializing Playnite media files context ${_context_id}`);
			await fileSystemService.mkdir(_tmp_dir_path, {
				recursive: true,
				mode: "0744",
			});
			await fileSystemService.mkdir(_tmp_optimized_dir_path, { mode: "0744" });
			logService.debug(`Created temporary folder at ${_tmp_dir_path}`);
			initialized = true;
		},
	};
	return Object.freeze(context);
};
