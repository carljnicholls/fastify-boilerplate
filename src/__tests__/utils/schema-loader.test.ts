import { vi, expect, describe, it, beforeEach } from "vitest";
import { getSchemaFiles, addValidSchemas } from "../../utils/schema-loader.js";
import { vol } from "memfs";
import { join } from "path";
import { importSchema, isTypeBoxObject } from "../../utils/type-box.js";
import { Kind } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";

vi.mock("node:fs/promises", async () => {
    const mem = await vi.importActual<typeof import("memfs")>("memfs");
    return {
        ...mem.fs.promises,
        readdir: mem.fs.promises.readdir,
        readFile: mem.fs.promises.readFile,
    };
});

vi.mock("../../utils/type-box.js", () => ({
    importSchema: vi.fn(),
    isTypeBoxObject: vi.fn(),
}));

let mockFastify: FastifyInstance;
const schemaDir = "/test/src/schemas/public";

describe("schema loader", () => {
    beforeEach(() => {
        vol.reset();
        mockFastify = {
            addSchema: vi.fn(),
        } as unknown as FastifyInstance;
    });

    describe("getSchemaFiles", () => {
        it("should return an array of schema files", async () => {
            const json = {
                [join(schemaDir, "README.md")]: "1",
                [join(schemaDir, "user.ts")]: "4",
                [join(schemaDir, "auth.js")]: "5",
                "/test/src/index.js": "2",
            };
            vol.fromJSON(json);

            const result = await getSchemaFiles(schemaDir);

            expect(result).toContain("user.ts");
            expect(result).toContain("auth.js");
            expect(result).not.toContain("readme.md");
        });

        it("should throw an error if directory does not exist", async () => {
            vol.fromJSON({}, "/empty");
            await expect(getSchemaFiles("/empty")).rejects.toThrow(
                "ENOENT: no such file or directory, scandir '/empty'",
            );
        });

        it("should throw an error if no schema files are found", async () => {
            const json = {
                [join(schemaDir, "README.md")]: "1",
            };
            vol.fromJSON(json);
            await expect(getSchemaFiles(schemaDir)).rejects.toThrow(
                "No schema files found in `../schemas/public` directory",
            );
        });

        it("should return only .ts and .js files", async () => {
            const json = {
                [join(schemaDir, "user.ts")]: "4",
                [join(schemaDir, "auth.js")]: "5",
                [join(schemaDir, "README.md")]: "1",
                "/test/src/index.js": "2",
            };
            vol.fromJSON(json);

            const result = await getSchemaFiles(schemaDir);

            expect(result).toContain("user.ts");
            expect(result).toContain("auth.js");
            expect(result).not.toContain("README.md");
            expect(result).not.toContain("index.js");
        });
    });

    describe("addValidSchemas", () => {
        it("should add valid schemas to fastify instance", async () => {
            const schemaFiles = ["user.ts"];

            const mockSchema = {
                User: { [Kind]: "Object" },
            };

            vi.mocked(importSchema).mockResolvedValue(mockSchema);
            vi.mocked(isTypeBoxObject).mockReturnValue(true);

            await addValidSchemas(schemaFiles, schemaDir, mockFastify);

            expect(importSchema).toHaveBeenCalledWith(
                join(schemaDir, "user.ts"),
            );
            expect(isTypeBoxObject).toHaveBeenCalledWith(mockSchema.User);
            expect(mockFastify.addSchema).toHaveBeenCalledWith(mockSchema.User);
        });

        it("should skip non-TypeBox objects", async () => {
            const schemaFiles = ["user.ts"];

            const mockSchema = {
                NotASchema: { something: "else" },
            };

            vi.mocked(importSchema).mockResolvedValue(mockSchema);
            vi.mocked(isTypeBoxObject).mockReturnValue(false);

            await addValidSchemas(schemaFiles, schemaDir, mockFastify);

            expect(mockFastify.addSchema).not.toHaveBeenCalled();
        });
    });
});
