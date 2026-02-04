import type { GameLibraryFilter } from "../domain/game-library-filter";

export type IGameLibraryFilterHasherPort = {
	computeHash: (props: {
		query: GameLibraryFilter["Query"];
		queryVersion: GameLibraryFilter["QueryVersion"];
	}) => Promise<string>;
};

export class GameLibraryFilterHasher implements IGameLibraryFilterHasherPort {
	private static readonly SEP = 0x00;
	private readonly encoder = new TextEncoder();

	private appendBytes(chunks: Uint8Array[], bytes: Uint8Array) {
		chunks.push(bytes);
		chunks.push(Uint8Array.of(GameLibraryFilterHasher.SEP));
	}

	private appendString(chunks: Uint8Array[], value: string | null) {
		this.appendBytes(chunks, value === null ? new Uint8Array() : this.encoder.encode(value));
	}

	private appendBool(chunks: Uint8Array[], value: boolean | null) {
		this.appendString(chunks, value === null ? null : value ? "1" : "0");
	}

	private appendNumber(chunks: Uint8Array[], value: number | null) {
		this.appendString(chunks, value === null ? null : value.toString());
	}

	private buildPayload(chunks: Uint8Array[]): Uint8Array {
		const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
		const buffer = new Uint8Array(totalLength);

		let offset = 0;
		for (const chunk of chunks) {
			buffer.set(chunk, offset);
			offset += chunk.length;
		}

		return buffer;
	}

	async computeHash({
		query,
		queryVersion,
	}: Parameters<IGameLibraryFilterHasherPort["computeHash"]>[0]): Promise<string> {
		const chunks: Uint8Array[] = [];

		this.appendNumber(chunks, queryVersion);

		this.appendString(chunks, query.Sort.type);
		this.appendString(chunks, query.Sort.direction ?? null);

		if (query.Filter) {
			this.appendBool(chunks, query.Filter.installed ?? null);
			this.appendString(chunks, query.Filter.search?.trim().toLocaleLowerCase("en-US") ?? null);
		} else {
			this.appendString(chunks, null);
			this.appendString(chunks, null);
		}

		const payload = this.buildPayload(chunks);
		const digest = await crypto.subtle.digest("SHA-256", payload);

		return this.toBase64(digest);
	}

	private toBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer);
		let binary = "";
		for (const b of bytes) binary += String.fromCharCode(b);
		return btoa(binary);
	}
}
