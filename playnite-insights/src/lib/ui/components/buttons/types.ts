import type { HTMLButtonAttributes } from "svelte/elements";
import type { ComponentSize, ComponentVariant } from "../types";

export type BaseButtonStates = "loading" | "selected" | "active" | "disabled" | "default";

export type BaseButtonProps = Omit<HTMLButtonAttributes, "disabled"> & {
	button?: HTMLButtonElement;
	justify?: "center" | "between" | "start";
	variant?: ComponentVariant;
	rounded?: boolean;
	size?: ComponentSize;
	iconOnly?: boolean;
	state?: BaseButtonStates;
};
