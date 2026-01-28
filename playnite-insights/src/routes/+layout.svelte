<script lang="ts">
	import { ClientCompositionRoot, type ClientApiV1 } from "$lib/modules/bootstrap/application";
	import { setClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import "../app.css";

	const { children } = $props();
	const root = new ClientCompositionRoot();
	const apiPromise: Promise<ClientApiV1> = root.buildAsync();

	let api: ClientApiV1;
	const getApi = (): ClientApiV1 => api;

	void apiPromise.then(async (clientApi) => {
		api = clientApi;
	});

	setClientApiContext(getApi);
</script>

{#await apiPromise}
	<AppLayout>
		<Main class="p-0!"></Main>
	</AppLayout>
{:then}
	{@render children()}
{:catch}
	<p class="text-error">Failed to initialize application</p>
{/await}
