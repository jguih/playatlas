import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/build/**",
			"**/.svelte-kit/**",
			"**/coverage/**",
			"**/test-results/**",
		],
	},

	js.configs.recommended,
	...ts.configs.recommended,
	prettier,

	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			"no-undef": "off",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					fixStyle: "separate-type-imports",
				},
			],
			"no-duplicate-imports": "error",
		},
	},
);
