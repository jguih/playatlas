export type SearchBottomSheetTypes = {
	onClose: () => void;
	value?: string | number;
	onChange: (value?: string | null) => void;
};
