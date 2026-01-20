<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		title,
		description,
		actions,
		children,
	}: {
		title?: string;
		description?: string;
		actions?: Snippet;
		children?: Snippet;
	} = $props();
</script>

<section
	class="
		bg-background-1
		space-y-4 rounded-xl
		border
		border-neutral-800/60
		p-4
	"
>
	{#if title || description || actions}
		<header class="flex items-start justify-between gap-4">
			<div class="space-y-1">
				{#if title}
					<h2 class="text-foreground text-sm font-medium">
						{title}
					</h2>
				{/if}

				{#if description}
					<p class="text-xs text-neutral-400">
						{description}
					</p>
				{/if}
			</div>

			{#if actions}
				<div class="shrink-0">
					{@render actions()}
				</div>
			{/if}
		</header>
	{/if}

	<div class="bg-background-2 rounded-lg p-4">
		{@render children?.()}
	</div>
</section>
