import type {
	HTMLInputAttributes,
	HTMLSelectAttributes,
	HTMLTextareaAttributes,
} from "svelte/elements";
import type { ComponentSize, ComponentVariant } from "../types";

export type BaseInputProps = {
	value?: string | number | null;
	input?: HTMLInputElement | null;
	variant?: ComponentVariant;
	size?: ComponentSize;
} & Omit<HTMLInputAttributes, "size" | "input" | "value">;

export type BaseTextareaProps = {
	value?: string | number | null;
	textArea?: HTMLTextAreaElement | null;
	onMount?: (props: { textArea?: HTMLTextAreaElement | null }) => void;
} & Omit<HTMLTextareaAttributes, "value">;

export type BaseCheckboxProps = {
	checked: boolean;
	color?: ComponentVariant;
} & Omit<BaseInputProps, "size">;

export type BaseSelectProps = { value?: string | number | null } & Omit<
	HTMLSelectAttributes,
	"value"
>;
