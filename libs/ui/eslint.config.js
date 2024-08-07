const { FlatCompat } = require("@eslint/eslintrc");
const baseConfig = require("../../eslint.config.js");
const js = require("@eslint/js");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    ...baseConfig,
    ...compat
        .config({ extends: ["plugin:@nx/angular", "plugin:@angular-eslint/template/process-inline-templates"] })
        .map((config) => ({
            ...config,
            files: ["**/*.ts"],
            rules: {
                ...config.rules,
                "@angular-eslint/directive-selector": [
                    "error",
                    {
                        type: "attribute",
                        prefix: "ui",
                        style: "camelCase",
                    },
                ],
                "@angular-eslint/component-selector": [
                    "error",
                    {
                        type: "element",
                        prefix: "ui",
                        style: "kebab-case",
                    },
                ],
            },
            languageOptions: { parserOptions: { project: ["libs/ui/tsconfig.*?.json"] } },
        })),
    ...compat.config({ extends: ["plugin:@nx/angular-template"] }).map((config) => ({
        ...config,
        files: ["**/*.html"],
        rules: {
            ...config.rules,
        },
    })),
];
