<script lang="ts">
	import { resolve } from "$app/paths";
	import { cubicInOut } from "svelte/easing";
	import type { HTMLAttributes } from "svelte/elements";
	import { fade } from "svelte/transition";
	import type { GameCardProps } from "./game-card.projection";

	const {
		game,
		displayName = true,
		...props
	}: GameCardProps & HTMLAttributes<HTMLLIElement> = $props();

	const buildCoverParams = (imagePath?: string | null): string => {
		if (!imagePath) return "cover";
		return `cover/${imagePath.replace(/^\/+|\/+$/g, "")}`;
	};
</script>

<li
	{...props}
	class={[
		"list-none w-full aspect-[1/1.6] [content-visibility:auto] [contain-intrinsic-size:auto_240px] contain-paint",
		"bg-background-1 shadow-default m-0 p-0",
		"border-3 border-black/20",
		"hover:border-primary-light-hover-fg",
		"active:border-primary-light-active-fg",
		"focus-within:border-primary-light-selected-fg",
		"transition-colors-default",
		props.class,
	]}
	transition:fade={{ duration: 120, easing: cubicInOut }}
>
	<a
		href={resolve("/game/[gameId]", { gameId: game.id })}
		class="outline-none"
	>
		<img
			src={resolve(`/api/assets/image/[...params]`, {
				params: buildCoverParams(game.coverImageFilePath),
			})}
			width="600"
			height="900"
			alt={`Cover of ${game.name}`}
			loading="lazy"
			decoding="async"
			fetchpriority="low"
			class={["w-full object-cover", displayName ? "h-7/8" : "h-full"]}
		/>
		{#if displayName}
			<div class="h-1/8 bottom-0 flex w-full flex-row items-center justify-center p-2">
				<p class="truncate text-center">{game.name}</p>
			</div>
		{/if}
	</a>
</li>
