<script lang="ts">
	import { ClientCompositionRoot, type ClientApi } from "$lib/modules/bootstrap/application";
	import { setClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import "../app.css";

	const { children } = $props();

	let api: ClientApi;

	const root = new ClientCompositionRoot();
	const apiPromise = root.buildAsync().then((clientApi) => {
		api = clientApi;
	});

	const getApi = () => api;

	setClientApiContext(getApi);
</script>

{#await apiPromise}
	<Spinner />
{:then}
	{@render children()}
{/await}
