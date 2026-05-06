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
                statements: 65,
                branches: 70,
                functions: 54,
                lines: 65,
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
