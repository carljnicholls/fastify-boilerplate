import { Type, type Static } from "@sinclair/typebox";

export const IdParamSchema = Type.Object({
    id: Type.String({ format: "uuid" }),
});

// Infer the TypeScript type
export type IdParam = Static<typeof IdParamSchema>;
