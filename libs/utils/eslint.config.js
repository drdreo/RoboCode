const baseConfig = require("../../eslint.config.js");

module.exports = [
    ...baseConfig,
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        rules: {},
        languageOptions: { parserOptions: { project: ["libs/utils/tsconfig.*?.json"] } },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {},
    },
    {
        files: ["**/*.js", "**/*.jsx"],
        rules: {},
    },
];
