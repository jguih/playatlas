import type { ZodSchema } from "zod";
import { ValidationError } from "../../errors";
import type { HttpResponseParser } from "./http-response.parser";

export const zodJsonParser =
	<T>(schema: ZodSchema<T>): HttpResponseParser<T> =>
	async (response: Response) => {
		const json = await response.json();

		const { success, data, error } = schema.safeParse(json);

		if (success) return data;

		throw new ValidationError(`Validation error: ${error.issues}`, error);
	};
