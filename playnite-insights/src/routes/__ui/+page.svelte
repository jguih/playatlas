<script lang="ts">
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import SolidButton from "$lib/ui/components/buttons/SolidButton.svelte";
	import ComponentSection from "$lib/ui/components/ComponentSection.svelte";
</script>

<main class={["flex gap-4 p-4"]}>
	<ComponentSection
		title="Button"
		description="Solid buttons"
	>
		<div class="flex gap-2">
			<SolidButton variant="primary">Primary</SolidButton>
			<SolidButton variant="error">Error</SolidButton>
			<SolidButton variant="neutral">Neutral</SolidButton>
			<SolidButton variant="warning">Warning</SolidButton>
			<SolidButton variant="success">Success</SolidButton>
		</div>
		<div class="flex gap-2">
			<SolidButton
				disabled
				variant="primary">Primary</SolidButton
			>
			<SolidButton
				disabled
				variant="error">Error</SolidButton
			>
			<SolidButton
				disabled
				variant="neutral">Neutral</SolidButton
			>
			<SolidButton
				disabled
				variant="warning">Warning</SolidButton
			>
			<SolidButton
				disabled
				variant="success">Success</SolidButton
			>
		</div>
		<div class="flex gap-2">
			<SolidButton
				selected
				variant="primary"
				>Primary
			</SolidButton>
			<SolidButton
				selected
				variant="error"
				>Error
			</SolidButton>
			<SolidButton
				selected
				variant="neutral"
				>Neutral
			</SolidButton>
			<SolidButton
				selected
				variant="warning"
				>Warning
			</SolidButton>
			<SolidButton
				selected
				variant="success"
				>Success
			</SolidButton>
		</div>
	</ComponentSection>
	<ComponentSection
		title="Button"
		description="Light buttons"
	>
		<div class="flex gap-2">
			<LightButton variant="primary">Primary</LightButton>
			<LightButton variant="error">Error</LightButton>
			<LightButton variant="neutral">Neutral</LightButton>
			<LightButton variant="warning">Warning</LightButton>
			<LightButton variant="success">Success</LightButton>
		</div>
		<div class="flex gap-2">
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
		</div>
		<div class="flex gap-2">
			<LightButton
				selected
				variant="primary">Primary</LightButton
			>
			<LightButton
				selected
				variant="error">Error</LightButton
			>
			<LightButton
				selected
				variant="neutral">Neutral</LightButton
			>
			<LightButton
				selected
				variant="warning">Warning</LightButton
			>
			<LightButton
				selected
				variant="success">Success</LightButton
			>
		</div>
		<div class="flex gap-2">
			<LightButton
				size="sm"
				variant="primary">Small</LightButton
			>
			<LightButton
				size="md"
				variant="primary">Medium</LightButton
			>
			<LightButton
				size="lg"
				variant="primary">Large</LightButton
			>
		</div>
		<div class="flex gap-2">
			<LightButton
				isLoading
				variant="primary">Primary</LightButton
			>
			<LightButton
				isLoading
				variant="error">Error</LightButton
			>
			<LightButton
				isLoading
				variant="neutral">Neutral</LightButton
			>
			<LightButton
				isLoading
				variant="warning">Warning</LightButton
			>
			<LightButton
				isLoading
				variant="success">Success</LightButton
			>
		</div>
	</ComponentSection>
</main>
