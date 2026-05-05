import { Kind, type TSchema } from "@sinclair/typebox";
import { pathToFileURL } from "url";

export const isTypeBoxObject = (schema: unknown): schema is TSchema => {
    return (
        schema !== null &&
        typeof schema === "object" &&
        "$id" in schema &&
        Kind in schema
    );
};

export const importSchema = async (
    schemaPath: string,
): Promise<Record<string, TSchema | unknown>> => {
    return await import(pathToFileURL(schemaPath).href);
};
