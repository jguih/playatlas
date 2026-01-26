import type { HTMLAttributes } from "svelte/elements";
import type { ComponentVariant } from "../types";

export type ChipProps = HTMLAttributes<HTMLSpanElement> & {
	variant?: ComponentVariant;
};
