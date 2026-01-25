<script lang="ts">
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import { ArrowLeftIcon } from "@lucide/svelte";

	const { params } = $props();
</script>

<AppLayout>
	{#snippet header()}
		<Header>
			<div class="mr-auto block w-fit">
				<LightButton
					variant="neutral"
					iconOnly
					onclick={() => history.back()}
				>
					<Icon>
						<ArrowLeftIcon />
					</Icon>
				</LightButton>
			</div>
		</Header>
	{/snippet}
	{#snippet banner()}
		<div></div>
	{/snippet}

	<Main>
		{params.gameId}
	</Main>
</AppLayout>
