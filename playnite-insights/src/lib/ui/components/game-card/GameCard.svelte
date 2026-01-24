<script lang="ts">
	import { resolve } from "$app/paths";
	import type { GameCardProps } from "./game-card.projection";

	const { game }: GameCardProps = $props();

	const getCoverImageFileName = (coverImagePath: GameCardProps["game"]["coverImageFilePath"]) => {
		if (!coverImagePath) return "placeholder.webp";
		const [, imageFileName] = coverImagePath.split("/");
		return imageFileName;
	};
</script>

<li
	class={[
		"list-none w-full aspect-[1/1.6] [content-visibility:auto] [contain-intrinsic-size:auto_240px] contain-paint",
		"bg-background-1 shadow-default m-0 p-0",
		"border-3 border-black/20",
		"hover:border-primary-light-hover-fg",
		"active:border-primary-light-active-fg",
		"focus-within:border-primary-light-selected-fg",
		"transition-colors-default",
	]}
>
	<a
		href={resolve("/")}
		class="outline-none"
	>
		<img
			src={resolve(`/api/assets/image/[playniteGameId]/[playniteImageFileName]`, {
				playniteGameId: game.id ?? "unknown",
				playniteImageFileName: getCoverImageFileName(game.coverImageFilePath),
			})}
			width="300"
			height="480"
			alt={`Cover of ${game.name}`}
			loading="lazy"
			decoding="async"
			fetchpriority="low"
			class="h-7/8 w-full object-cover"
		/>
		<div class="h-1/8 bottom-0 flex w-full flex-row items-center justify-center p-2">
			<p class="truncate text-center">{game.name}</p>
		</div>
	</a>
</li>
