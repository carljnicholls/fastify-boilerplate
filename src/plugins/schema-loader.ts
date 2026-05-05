import type {
    FastifyInstance,
    FastifyPluginOptions,
} from "fastify";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { addValidSchemas, getSchemaFiles } from "../utils/schema-loader.js";
import fp from "fastify-plugin";

/**
 * Adds all typebox schema in the `../schemas/public` directory recursively
 * @param fastify
 * @param _opts
 */
async function schemaLoader(
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
): Promise<void> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const schemaDir = join(__dirname, "..", "schemas", "public");

    const schemaFiles = await getSchemaFiles(schemaDir);
    await addValidSchemas(schemaFiles, schemaDir, fastify);
}

export default fp(schemaLoader, {
    name: "schema-loader",
});
