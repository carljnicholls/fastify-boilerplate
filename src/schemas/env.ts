import { Type, type Static } from "@sinclair/typebox";

export const EnvSchema = Type.Object(
    {
        NODE_ENV: Type.Optional(
            Type.Union(
                [
                    Type.Literal("development"),
                    Type.Literal("production"),
                    Type.Literal("test"),
                ],
                { default: "development" },
            ),
        ),

        APP_HOST: Type.String({ default: "0.0.0.0" }),
        APP_PORT: Type.Integer({ default: 8080 }),

        MOSQUITTO_HOST: Type.String({ default: "localhost" }),
        MOSQUITTO_PORT: Type.Integer({ default: 1883 }),
        MOSQUITTO_WS_PORT: Type.Integer({ default: 9001 }),

        POSTGRES_USER: Type.String({
            description: "PostgreSQL user",
        }),
        POSTGRES_HOST: Type.String({
            description: "PostgreSQL host",
        }),
        POSTGRES_DB: Type.String({
            description: "PostgreSQL database name",
        }),
        POSTGRES_PASSWORD: Type.String({
            description: "PostgreSQL password",
        }),
        POSTGRES_PORT: Type.String({
            description: "PostgreSQL port",
        }),

        REDIS_HOST: Type.String({ default: "redis://localhost" }),
        REDIS_PORT: Type.Integer({ default: 6379 }),
        REDIS_CACHE_TIMEOUT: Type.Integer({ default: 600 }),
    },
    { $id: "env" },
);

export type Env = Static<typeof EnvSchema>;
