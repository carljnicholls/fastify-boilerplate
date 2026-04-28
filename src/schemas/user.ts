import { Type, type Static } from "@sinclair/typebox";

export const UserSchema = Type.Object(
    {
        user_id: Type.Optional(Type.String({ format: "uuid" })),
        username: Type.String({
            minLength: 1,
            maxLength: 255,
        }),
        email: Type.String({
            format: "email",
            maxLength: 255,
        }),
        first_name: Type.Optional(
            Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
        ),
        last_name: Type.Optional(
            Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
        ),
    },
    { $id: "user_id",   },
);
export type User = Static<typeof UserSchema>;

export const UserPasswordSchema = Type.Intersect([UserSchema, Type.Object({ password: Type.String({ minLength: 8 }) })])
export type UserWithPassword = Static<typeof UserPasswordSchema>;
