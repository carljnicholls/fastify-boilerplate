import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            include: ["src/**"],
            exclude: [
                "node_modules/**",
                "src/index.ts",
                "**__tests__**",
                "**/*.d.ts",
            ],
            provider: "v8",
            reportsDirectory: "coverage",
            reporter: [
                "text",
                "cobertura",
            ],
            thresholds: {
                lines: 35,
                branches: 50,
                functions: 28,
                statements: 35,
            },
        },
        reporters: [
            "default",
            "junit",
        ],

        outputFile: {
            junit: "coverage/junit.xml",
            cobertura: "coverage/cobertura.xml",
            html: "coverage/html/",
        },
    },
});
