import { Type, type Static } from "@sinclair/typebox";

export const ErrorSchema = Type.Object({
    message: Type.String(),
    error: Type.String(),
    code: Type.Optional(Type.String()),
    statusCode: Type.Optional(Type.String()),
});

export type ErrorType = Static<typeof ErrorSchema>;