import type * as fs from "fs";
import type * as stream from "stream";
import type * as streamAsync from "stream/promises";

export type StreamUtilsService = {
	readableFromWeb: typeof stream.Readable.fromWeb;
	pipeline: typeof streamAsync.pipeline;
	createWriteStream: typeof fs.createWriteStream;
};
