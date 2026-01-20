import type { HTMLAttributes } from "svelte/elements";

export type SidebarEventHandlers = {
	onClose?: () => void;
};

export type SidebarProps = HTMLAttributes<HTMLElement> &
	SidebarEventHandlers & {
		width?: number;
	};

export type BottomSheetProps = HTMLAttributes<HTMLElement> &
	SidebarEventHandlers & { height?: number };
