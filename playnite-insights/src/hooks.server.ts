import { env } from "$env/dynamic/private";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { makeServerServices, type ServerServices } from "$lib/server/setup-services";
import { makeAppCompositionRoot, type PlayAtlasApiV1 } from "@playatlas/bootstrap/application";
import { type Handle, type ServerInit } from "@sveltejs/kit";
import { randomUUID } from "crypto";

let _services: ServerServices;
let _api: PlayAtlasApiV1;

export const init: ServerInit = async () => {
	const root = makeAppCompositionRoot({ env });
	_api = await root.buildAsync();

	_services = makeServerServices({
		getDb: () => root.unsafe.infra.getDb(),
		env: {
			DATA_DIR: _api.system.getSystemConfig().getDataDir(),
			PLAYNITE_HOST_ADDRESS: env.PLAYATLAS_PLAYNITE_HOST_ADDRESS,
		},
	});

	const now = new Date();
	try {
		const syncId = _services.synchronizationIdRepository.get();
		if (!syncId) {
			const syncId = randomUUID();
			_services.synchronizationIdRepository.set({
				Id: 1,
				SyncId: randomUUID(),
				CreatedAt: now.toISOString(),
				LastUsedAt: now.toISOString(),
			});
			_services.logService.info(`Created synchronization id: ${syncId}`);
		}
	} catch (error) {
		_services.logService.error(`Failed to create synchronization id`, error);
	}
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale),
		});
	});

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.services = _services;
	event.locals.api = _api;

	// Apply CORS header for API routes
	if (event.url.pathname.startsWith("/api")) {
		// Required for CORS to work
		if (event.request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "*",
				},
			});
		}
	}

	const response = await handleParaglide({ event, resolve });

	if (event.url.pathname.startsWith("/api")) {
		response.headers.append("Access-Control-Allow-Origin", `*`);
	}

	return response;
};
