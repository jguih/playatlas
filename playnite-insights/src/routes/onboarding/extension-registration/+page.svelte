<script lang="ts">
	import { getClientApiContext } from "$lib/modules/bootstrap/application";
	import Main from "$lib/ui/components/Main.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import type { ExtensionRegistrationResponseDto } from "@playatlas/auth/dtos";

	const api = getClientApiContext();
	const registrationState: { registrations: ExtensionRegistrationResponseDto[]; loading: boolean } =
		$state({
			registrations: [],
			loading: true,
		});

	void api()
		.Auth.ExtensionRegistrationClient.getAllAsync()
		.then(({ registrations }) => {
			registrationState.registrations = registrations;
		})
		.finally(() => (registrationState.loading = false));
</script>

<Main class="h-dvh w-dvw flex items-center justify-center">
	{#if registrationState.loading}
		<Spinner variant="primary" />
	{:else}
		{#each registrationState.registrations as registration (registration.Id)}
			<p>{registration.ExtensionVersion}</p>
		{/each}
	{/if}
</Main>
