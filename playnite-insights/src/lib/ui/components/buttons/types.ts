import type { HTMLButtonAttributes } from "svelte/elements";
import type { ComponentSize, SemanticColors } from "../types";

export type BaseButtonProps = HTMLButtonAttributes & {
	button?: HTMLButtonElement;
	justify?: "center" | "between" | "start";
	variant?: SemanticColors;
	rounded?: boolean;
	size?: ComponentSize;
	isLoading?: boolean;
	selected?: boolean;
};
