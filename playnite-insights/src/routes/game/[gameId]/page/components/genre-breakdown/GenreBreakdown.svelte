<script lang="ts">
	import Dropdown from "$lib/ui/components/dropdown/Dropdown.svelte";
	// import type { ClassificationId } from "@playatlas/common/domain";

	// type GenreBreakdownProps = {
	// 	classificationId: ClassificationId;
	// };

	// const props = $props();
</script>

<Dropdown>
	{#snippet label()}
		<span>Dropdown</span>
	{/snippet}
</Dropdown>
