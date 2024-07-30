module.exports = {
    displayName: "utils",
    preset: "../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../coverage/libs/utils",
};
