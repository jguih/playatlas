export default {
	useTabs: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 100,
	singleAttributePerLine: true,
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
			},
		},
	],
};
