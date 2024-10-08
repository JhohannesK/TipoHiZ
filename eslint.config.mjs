import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        "plugin:react/recommended",
        "prettier",
        "plugin:@typescript-eslint/recommended"
    ),
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            react,
            prettier,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                    arrowFunctions: true,
                },
            },
        },

        settings: {
            react: {
                version: "detect",  // Automatically detect the React version
            },
        },

        rules: {
            "prettier/prettier": ["off"],
        },
    },
];
