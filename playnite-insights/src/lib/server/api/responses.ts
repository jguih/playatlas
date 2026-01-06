import { json } from '@sveltejs/kit';

export type ApiErrorResponse = {
	error: {
		message: string;
		details?: object;
	};
};

const errorResponse = (body: ApiErrorResponse, init: ResponseInit = { status: 400 }) => {
	return json(body, init);
};

const successResponse = (status: 200 | 201 = 200) => {
	return json({ status: 'ok' }, { status });
};

export const apiResponse = {
	ok: () => successResponse(200),
	error: errorResponse,
	success: successResponse,
	notModified: () => new Response(undefined, { status: 304 }),
	created: () => successResponse(201),
};
