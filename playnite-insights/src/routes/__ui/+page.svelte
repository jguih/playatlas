<script lang="ts">
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import SolidButton from "$lib/ui/components/buttons/SolidButton.svelte";
	import ComponentDisplayContainer from "$lib/ui/components/ComponentDisplayContainer.svelte";
	import ComponentSection from "$lib/ui/components/ComponentSection.svelte";
	import ComponentSectionText from "$lib/ui/components/ComponentSectionText.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
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
				<SolidButton variant="primary">Primary</SolidButton>
				<SolidButton variant="error">Error</SolidButton>
				<SolidButton variant="neutral">Neutral</SolidButton>
				<SolidButton variant="warning">Warning</SolidButton>
				<SolidButton variant="success">Success</SolidButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Disabled state</ComponentSectionText>
			<ComponentDisplayContainer>
				<SolidButton
					disabled
					variant="primary"
				>
					Primary
				</SolidButton>
				<SolidButton
					disabled
					variant="error"
				>
					Error
				</SolidButton>
				<SolidButton
					disabled
					variant="neutral"
				>
					Neutral
				</SolidButton>
				<SolidButton
					disabled
					variant="warning"
				>
					Warning
				</SolidButton>
				<SolidButton
					disabled
					variant="success"
				>
					Success
				</SolidButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Selected state</ComponentSectionText>
			<ComponentDisplayContainer>
				<SolidButton
					selected
					variant="primary"
				>
					Primary
				</SolidButton>
				<SolidButton
					selected
					variant="error"
				>
					Error
				</SolidButton>
				<SolidButton
					selected
					variant="neutral"
				>
					Neutral
				</SolidButton>
				<SolidButton
					selected
					variant="warning"
				>
					Warning
				</SolidButton>
				<SolidButton
					selected
					variant="success"
				>
					Success
				</SolidButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Sizes</ComponentSectionText>
			<ComponentDisplayContainer>
				<SolidButton
					size="sm"
					variant="primary"
				>
					Small
				</SolidButton>
				<SolidButton
					size="md"
					variant="primary"
				>
					Medium
				</SolidButton>
				<SolidButton
					size="lg"
					variant="primary"
				>
					Large
				</SolidButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Loading</ComponentSectionText>
			<ComponentDisplayContainer>
				<SolidButton
					isLoading
					variant="primary"
				>
					Primary
				</SolidButton>
				<SolidButton
					isLoading
					variant="error"
				>
					Error
				</SolidButton>
				<SolidButton
					isLoading
					variant="neutral"
				>
					Neutral
				</SolidButton>
				<SolidButton
					isLoading
					variant="warning"
				>
					Warning
				</SolidButton>
				<SolidButton
					isLoading
					variant="success"
				>
					Success
				</SolidButton>
			</ComponentDisplayContainer>
		</ComponentSection>

		<ComponentSection title="Light buttons">
			<ComponentSectionText>Static state</ComponentSectionText>
			<ComponentDisplayContainer>
				<LightButton variant="primary">Primary</LightButton>
				<LightButton variant="error">Error</LightButton>
				<LightButton variant="neutral">Neutral</LightButton>
				<LightButton variant="warning">Warning</LightButton>
				<LightButton variant="success">Success</LightButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Disabled state</ComponentSectionText>
			<ComponentDisplayContainer>
				<LightButton
					disabled
					variant="primary">Primary</LightButton
				>
				<LightButton
					disabled
					variant="error">Error</LightButton
				>
				<LightButton
					disabled
					variant="neutral">Neutral</LightButton
				>
				<LightButton
					disabled
					variant="warning">Warning</LightButton
				>
				<LightButton
					disabled
					variant="success">Success</LightButton
				>
			</ComponentDisplayContainer>
			<ComponentSectionText>Selected state</ComponentSectionText>
			<ComponentDisplayContainer>
				<LightButton
					selected
					variant="primary"
				>
					Primary
				</LightButton>
				<LightButton
					selected
					variant="error"
				>
					Error
				</LightButton>
				<LightButton
					selected
					variant="neutral"
				>
					Neutral
				</LightButton>
				<LightButton
					selected
					variant="warning"
				>
					Warning
				</LightButton>
				<LightButton
					selected
					variant="success"
				>
					Success
				</LightButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Sizes</ComponentSectionText>
			<ComponentDisplayContainer>
				<LightButton
					size="sm"
					variant="primary"
				>
					Small
				</LightButton>
				<LightButton
					size="md"
					variant="primary"
				>
					Medium
				</LightButton>
				<LightButton
					size="lg"
					variant="primary"
				>
					Large
				</LightButton>
			</ComponentDisplayContainer>
			<ComponentSectionText>Loading</ComponentSectionText>
			<ComponentDisplayContainer>
				<LightButton
					isLoading
					variant="primary"
				>
					Primary
				</LightButton>
				<LightButton
					isLoading
					variant="error"
				>
					Error
				</LightButton>
				<LightButton
					isLoading
					variant="neutral"
				>
					Neutral
				</LightButton>
				<LightButton
					isLoading
					variant="warning"
				>
					Warning
				</LightButton>
				<LightButton
					isLoading
					variant="success"
				>
					Success
				</LightButton>
			</ComponentDisplayContainer>
		</ComponentSection>
	</Main>
	{#snippet bottomNav()}
		<BottomNav></BottomNav>
	{/snippet}
</AppLayout>
