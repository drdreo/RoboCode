import type { Config } from "jest";

export default async (): Promise<Config> => {
    return {
        displayName: "ui",
        preset: "../../jest.preset.js",
        setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
        transform: {
            "^.+\\.(ts|mjs|js|html)$": [
                "jest-preset-angular",
                {
                    tsconfig: "<rootDir>/tsconfig.spec.json",
                    stringifyContentPathRegex: "\\.(html|svg)$",
                },
            ],
        },
        transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
        coverageDirectory: "../../coverage/libs/ui",
        snapshotSerializers: [
            "jest-preset-angular/build/serializers/no-ng-attributes",
            "jest-preset-angular/build/serializers/ng-snapshot",
            "jest-preset-angular/build/serializers/html-comment",
        ],
    };
};
