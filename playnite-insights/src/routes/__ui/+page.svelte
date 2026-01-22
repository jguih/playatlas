<script lang="ts">
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import SolidButton from "$lib/ui/components/buttons/SolidButton.svelte";
	import ComponentDisplayContainer from "$lib/ui/components/ComponentDisplayContainer.svelte";
	import ComponentSection from "$lib/ui/components/ComponentSection.svelte";
	import ComponentSectionText from "$lib/ui/components/ComponentSectionText.svelte";
	import GameCard from "$lib/ui/components/game-card/GameCard.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import BottomSheet from "$lib/ui/components/sidebar/BottomSheet.svelte";
	import Sidebar from "$lib/ui/components/sidebar/Sidebar.svelte";
	import type { SemanticColors } from "$lib/ui/components/types";
	import {
		HomeIcon,
		LayoutDashboardIcon,
		ListFilter,
		SearchIcon,
		SettingsIcon,
	} from "@lucide/svelte";

	const semanticVariants: SemanticColors[] = ["primary", "error", "neutral", "warning", "success"];

	const closeFiltersSidebar = () => {
		history.back();
	};

	const showFiltersSidebar = () => {
		pushState("", {
			showFiltersSidebar: true,
		});
	};

	const closeSearchDrawer = () => {
		history.back();
	};

	const showSearchDrawer = () => {
		pushState("", {
			showSearchDrawer: true,
		});
	};
</script>

{#if page.state.showFiltersSidebar}
	<Sidebar onClose={closeFiltersSidebar} />
{/if}

{#if page.state.showSearchDrawer}
	<BottomSheet onClose={closeSearchDrawer} />
{/if}

<AppLayout>
	{#snippet header()}
		<Header>
			<div class="ml-auto block w-fit">
				<LightButton
					variant="neutral"
					iconOnly
					onclick={showSearchDrawer}
				>
					<Icon>
						<SearchIcon />
					</Icon>
				</LightButton>
				<LightButton
					variant="neutral"
					iconOnly
					onclick={showFiltersSidebar}
				>
					<Icon>
						<ListFilter />
					</Icon>
				</LightButton>
			</div>
		</Header>
	{/snippet}
	{#snippet banner()}
		<div></div>
	{/snippet}
	<Main class={["flex flex-wrap gap-4 p-4"]}>
		<ComponentSection title="Solid Buttons">
			<ComponentSectionText>Static state</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<SolidButton {variant}>
						{variant}
					</SolidButton>
				{/each}
			</ComponentDisplayContainer>
			<ComponentSectionText>Disabled state</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<SolidButton
						state="disabled"
						{variant}
					>
						{variant}
					</SolidButton>
				{/each}
			</ComponentDisplayContainer>
			<ComponentSectionText>Selected state</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<SolidButton
						state="selected"
						{variant}
					>
						{variant}
					</SolidButton>
				{/each}
			</ComponentDisplayContainer>
			<ComponentSectionText>Sizes</ComponentSectionText>
			<ComponentDisplayContainer>
				<SolidButton
					size="sm"
					variant="primary"
				>
					small
				</SolidButton>
				<SolidButton
					size="md"
					variant="primary"
				>
					medium
				</SolidButton>
				<SolidButton
					size="lg"
					variant="primary"
				>
					large
				</SolidButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Loading</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<SolidButton
						state="loading"
						{variant}
					>
						{variant.toLocaleUpperCase()}
					</SolidButton>
				{/each}
			</ComponentDisplayContainer>

			<ComponentSectionText>Icons</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<SolidButton
						{variant}
						size="sm"
						iconOnly
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</SolidButton>
					<SolidButton
						{variant}
						size="md"
						iconOnly
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</SolidButton>
					<SolidButton
						{variant}
						size="lg"
						iconOnly
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</SolidButton>
				{/each}
			</ComponentDisplayContainer>
		</ComponentSection>

		<ComponentSection title="Solid Buttons">
			<ComponentSectionText>Static state</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<LightButton {variant}>
						{variant}
					</LightButton>
				{/each}
			</ComponentDisplayContainer>
			<ComponentSectionText>Disabled state</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<LightButton
						state="disabled"
						{variant}
					>
						{variant}
					</LightButton>
				{/each}
			</ComponentDisplayContainer>
			<ComponentSectionText>Selected state</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<LightButton
						state="selected"
						{variant}
					>
						{variant}
					</LightButton>
				{/each}
			</ComponentDisplayContainer>
			<ComponentSectionText>Sizes</ComponentSectionText>
			<ComponentDisplayContainer>
				<LightButton
					size="sm"
					variant="primary"
				>
					small
				</LightButton>
				<LightButton
					size="md"
					variant="primary"
				>
					medium
				</LightButton>
				<LightButton
					size="lg"
					variant="primary"
				>
					large
				</LightButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Loading</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<LightButton
						state="loading"
						{variant}
					>
						{variant.toLocaleUpperCase()}
					</LightButton>
				{/each}
			</ComponentDisplayContainer>

			<ComponentSectionText>Icons</ComponentSectionText>
			<ComponentDisplayContainer>
				{#each semanticVariants as variant (variant)}
					<LightButton
						{variant}
						size="sm"
						iconOnly
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</LightButton>
					<LightButton
						{variant}
						size="md"
						iconOnly
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</LightButton>
					<LightButton
						{variant}
						size="lg"
						iconOnly
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</LightButton>
				{/each}
			</ComponentDisplayContainer>
		</ComponentSection>

		<ComponentSection title="Game Card">
			<GameCard
				game={{
					name: "Minecraft",
					coverImagePath: `${window.origin}/placeholder/cover.png`,
					gamePagePath: "",
				}}
			/>
		</ComponentSection>
	</Main>
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
