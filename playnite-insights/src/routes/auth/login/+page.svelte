<script lang="ts">
	import { getClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import SolidButton from "$lib/ui/components/buttons/SolidButton.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import { ArrowLeftIcon, HomeIcon, LayoutDashboardIcon, SettingsIcon } from "@lucide/svelte";

	const api = getClientApiContext()();

	const loginAsync = async () => {
		const result = await api.Auth.AuthService.loginAsync({ password: "test123" });
		if (result.success) {
			await api.Auth.SessionIdProvider.setAsync(result.sessionId);
		}
	};
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

	<Main><SolidButton onclick={loginAsync}>Login</SolidButton></Main>

	{#snippet bottomNav()}
		<BottomNav>
			<LightButton
				size="lg"
				iconOnly
				state="active"
				aria-label="Home"
			>
				<Icon>
					<HomeIcon />
				</Icon>
			</LightButton>
			<LightButton
				size="lg"
				variant="neutral"
				iconOnly
				aria-label="Dashboard"
			>
				<Icon>
					<LayoutDashboardIcon />
				</Icon>
			</LightButton>
			<LightButton
				size="lg"
				variant="neutral"
				iconOnly
				aria-label="Settings"
			>
				<Icon>
					<SettingsIcon />
				</Icon>
			</LightButton>
		</BottomNav>
	{/snippet}
</AppLayout>
