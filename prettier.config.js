export default {
	useTabs: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 100,
	singleAttributePerLine: true,
	plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-svelte"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
			},
		},
	],
};
