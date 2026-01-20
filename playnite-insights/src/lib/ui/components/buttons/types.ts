import type { HTMLButtonAttributes } from "svelte/elements";
import type { ComponentSize, SemanticColors } from "../types";

export type BaseButtonStates = "loading" | "selected" | "active" | "disabled" | "default";

export type BaseButtonProps = Omit<HTMLButtonAttributes, "disabled"> & {
	button?: HTMLButtonElement;
	justify?: "center" | "between" | "start";
	variant?: SemanticColors;
	rounded?: boolean;
	size?: ComponentSize;
	iconOnly?: boolean;
	state?: BaseButtonStates;
};
