import type { GameLibraryFilter } from "$lib/modules/game-library/domain";

export type SearchBottomSheetProps = {
	onClose: () => void;
	onChange?: (value?: string | null) => void;
	value?: string | number;
	libraryFilterItems?: GameLibraryFilter[];
	onApplyFilterItem?: (item: GameLibraryFilter) => void;
};
