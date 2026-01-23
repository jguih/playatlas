<script lang="ts">
	import { resolve } from "$app/paths";
	import type { GameCardProps } from "./game-card.projection";

	const { game }: GameCardProps = $props();
</script>

<li
	class={[
		"list-none",
		"bg-background-1 shadow-default w-42 m-0 aspect-[1/1.6] h-64 p-0",
		"border-3 border-black/20",
		"hover:border-primary-light-hover-fg",
		"active:border-primary-light-active-fg",
		"focus-within:border-primary-light-selected-fg",
		"transition-colors-default",
	]}
>
	<a
		href={resolve("/__ui")}
		class="outline-none"
	>
		<img
			src={`${window.origin}/placeholder/cover.png`}
			width="300"
			height="480"
			alt={`Cover of ${game.name}`}
			loading="lazy"
			class="h-7/8 w-full object-cover"
		/>
		<div class="h-1/8 bottom-0 flex w-full flex-row items-center justify-center p-2">
			<p class="truncate text-center">{game.name}</p>
		</div>
	</a>
</li>
