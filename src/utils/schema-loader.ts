import type { FastifyInstance } from "fastify";
import { readdir } from "node:fs/promises";
import { join } from "path";
import { importSchema, isTypeBoxObject } from "./type-box.js";
import { noSchemaFilesFound } from "../constants/errors.js";

export const getSchemaFiles = async (schemaDir: string) => {
    const files = await readdir(schemaDir, { recursive: true });
    if (!files) throw new Error(noSchemaFilesFound);
    const schemaFiles = files.filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js"),
    );
    if (schemaFiles.length === 0) throw new Error(noSchemaFilesFound);
    return schemaFiles;
};

export const addValidSchemas = async (
    schemaFiles: string[],
    schemaDir: string,
    fastify: FastifyInstance,
) => {
    for (const file of schemaFiles) {
        const schemaPath = join(schemaDir, file);
        const schemaModule = await importSchema(schemaPath);

        for (const exportKey in schemaModule) {
            const schema = schemaModule[exportKey];
            if (isTypeBoxObject(schema)) {
                fastify.addSchema(schema);
            }
        }
    }
};
