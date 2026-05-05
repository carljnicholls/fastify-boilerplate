import type { FastifyInstance } from "fastify";
import { readdir } from "node:fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";
import { isTypeBoxObject } from "./type-box.js";

export const getSchemaFiles = async (schemaDir: string) => {
    const files = await readdir(schemaDir, { recursive: true });
    const schemaFiles = files.filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js"),
    );

    if (schemaFiles.length === 0)
        throw new Error(
            "No schema files found in `../schemas/public` directory",
        );

    return schemaFiles;
}

export const addValidSchemas = async (
    schemaFiles: string[],
    schemaDir: string,
    fastify: FastifyInstance,
) => {
    for (const file of schemaFiles) {
        const schemaPath = join(schemaDir, file);
        const schemaModule = await import(pathToFileURL(schemaPath).href);

        for (const exportKey in schemaModule) {
            const schema = schemaModule[exportKey]!;
            if (isTypeBoxObject(schema)) {
                fastify.addSchema(schema);
            }
        }
    }
}
