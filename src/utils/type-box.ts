import { Kind, type TSchema } from "@sinclair/typebox";

export const isTypeBoxObject = (schema: unknown): schema is TSchema => {
    return (
        schema !== null &&
        typeof schema === "object" &&
        "$id" in schema &&
        Kind in schema
    );
};
