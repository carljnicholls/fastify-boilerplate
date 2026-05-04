import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest/presets/default-esm", // Use the ESM preset
    
    testEnvironment: "node",
    clearMocks: true,
    coverageDirectory: "coverage",

    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },

    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: [
        // "/node_modules", 
        // "/src/schemas"
        "/src/types"
    ],

    coverageReporters: [
        "html", 
        "text", 
        "text-summary",
        "cobertura"
    ],

    reporters: ["default", ["jest-junit", { outputDirectory: "./coverage" }]],

    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],

    testPathIgnorePatterns: ["/node_modules/", "/dist/"],

    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true, // Crucial for "import" statements
                tsconfig: "tsconfig.json",
            },
        ],
    },
};

export default config;
