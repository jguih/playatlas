<script lang="ts">
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import SolidButton from "$lib/ui/components/buttons/SolidButton.svelte";
	import ComponentDisplayContainer from "$lib/ui/components/ComponentDisplayContainer.svelte";
	import ComponentSection from "$lib/ui/components/ComponentSection.svelte";
	import ComponentSectionText from "$lib/ui/components/ComponentSectionText.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import type { SemanticColors } from "$lib/ui/components/types";
	import { HomeIcon } from "@lucide/svelte";

	const semanticVariants: SemanticColors[] = ["primary", "error", "neutral", "warning", "success"];
</script>

<AppLayout>
	{#snippet header()}
		<Header />
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
						disabled
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
						selected
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
						isLoading
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
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</SolidButton>
					<SolidButton
						{variant}
						size="md"
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</SolidButton>
					<SolidButton
						{variant}
						size="lg"
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
						disabled
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
						selected
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
						isLoading
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
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</LightButton>
					<LightButton
						{variant}
						size="md"
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</LightButton>
					<LightButton
						{variant}
						size="lg"
					>
						<Icon>
							<HomeIcon />
						</Icon>
					</LightButton>
				{/each}
			</ComponentDisplayContainer>
		</ComponentSection>
	</Main>
	{#snippet bottomNav()}
		<BottomNav></BottomNav>
	{/snippet}
</AppLayout>
