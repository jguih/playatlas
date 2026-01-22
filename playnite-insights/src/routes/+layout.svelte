<script lang="ts">
	import { ClientCompositionRoot, type ClientApi } from "$lib/modules/bootstrap/application";
	import { setClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import "../app.css";

	const { children } = $props();
	const root = new ClientCompositionRoot();
	const apiPromise: Promise<ClientApi> = root.buildAsync();

	let api: ClientApi;
	const getApi = (): ClientApi => api;

	void apiPromise.then((clientApi) => {
		api = clientApi;
	});

	setClientApiContext(getApi);
</script>

{#await apiPromise}
	<Spinner />
{:then}
	{@render children()}
{:catch}
	<p class="text-error">Failed to initialize application</p>
{/await}
