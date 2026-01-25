export class GameAssets {
	static parseBackgroundImageParams = (imagePath?: string | null): string => {
		if (!imagePath) return "background";
		return `background/${imagePath.replace(/^\/+|\/+$/g, "")}`;
	};

	static parseCoverImageParams = (imagePath?: string | null): string => {
		if (!imagePath) return "cover";
		return `cover/${imagePath.replace(/^\/+|\/+$/g, "")}`;
	};
}
