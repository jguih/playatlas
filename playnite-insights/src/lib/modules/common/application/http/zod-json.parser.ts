import type { ZodSchema } from "zod";
import type { HttpResponseParser } from "./http-response.parser";

export const zodJsonParser =
	<T>(schema: ZodSchema<T>): HttpResponseParser<T> =>
	async (response: Response) => {
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const json = await response.json();

		const { success, data, error } = schema.safeParse(json);

		if (success) return data;

		throw new Error(`Validation error: ${error.message}`);
	};
