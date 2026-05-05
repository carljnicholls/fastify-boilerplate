import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true, 
        environment: "node",
        coverage: {
            include: ["src/**"],
            exclude: [
                "node_modules/**",
                "src/index.ts",
                "**__tests__**",
                "**/*.d.ts",
                "**/schemas/**",
                "**/__mocks__/**",
                // ignore interfaces
                "**/i-***.ts",
                "**/cors.ts",
            ],
            provider: "v8",
            reportsDirectory: "coverage",
            reporter: ["text", "cobertura"],
            thresholds: {
                statements: 45,
                branches: 60,
                functions: 35,
                lines: 45,
            },
        },
        reporters: ["default", "junit"],

        outputFile: {
            junit: "coverage/junit.xml",
            cobertura: "coverage/cobertura.xml",
            html: "coverage/html/",
        },
    },
});
