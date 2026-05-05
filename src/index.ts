import fastify from "fastify";
import cors from "@fastify/cors";
import env from "@fastify/env";
import { EnvSchema, type Env } from "./schemas/env.js";
import { corsSettings } from "./constants/cors.js";
import { UserRepository } from "./repository/users-repository.js";
import fastifyRedis from "@fastify/redis";
import addFormats from "ajv-formats";
import { fastifyPostgres } from "@fastify/postgres";
import packageJson from "../package.json" with { type: "json" };
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { v7 as uuidv7 } from "uuid";
import mqttPlugin from "./plugins/mqtt.js";
import type { IClientOptions } from "mqtt";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import autoLoad from "@fastify/autoload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify({
    logger: {
        level: "info",
        // file: "./logs/server.log",
    },
    ajv: {
        plugins: [[addFormats, { mode: "fast" }] as any],
    },
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(import("@fastify/swagger"), {
    openapi: {
        openapi: "3.1.1",
        info: {
            title: packageJson.name,
            description: packageJson.description,
            version: packageJson.version,
            //...
        },
    },
});
await server.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
        docExpansion: "list",
        deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, _request, _reply) => {
        return swaggerObject;
    },
    transformSpecificationClone: true,
});
// server.register(import("./plugins/open-api.js"));

await server.register(env, {
    schema: EnvSchema,
    dotenv: true,
    confKey: "config",
});
await server.after();

await server.register(cors, corsSettings);

const envVariables = server.getEnvs() as Env;
await server.register(fastifyPostgres, {
    connectionString: `postgres://${envVariables.POSTGRES_USER}:${envVariables.POSTGRES_PASSWORD}@${envVariables.POSTGRES_HOST}:${envVariables.POSTGRES_PORT}/${envVariables.POSTGRES_DB}`,
});
await server.after();
server.decorate("usersRepository", new UserRepository(server.pg.pool));

/** autoLoad schemas */
await server.register(autoLoad, {
    dir: join(__dirname, "plugins"),
    forceESM: true,
    // logLevel: "debug",
    matchFilter: /schema-loader\.(ts|js)$/,
});

/** autoLoad routes */
await server.register(autoLoad, {
    dir: join(__dirname, "routes"),
    forceESM: true,
    // logLevel: "debug",
    options: {
        prefix: "/api/v1",
    },
});

await server.register(fastifyRedis, {
    url: `${envVariables.REDIS_HOST}:${envVariables.REDIS_PORT}`,
});

await server.register(mqttPlugin, {
    hostname: envVariables.MOSQUITTO_HOST,
    port: envVariables.MOSQUITTO_PORT,
    clientId: uuidv7(),
} as IClientOptions);

await server.ready();
server.swagger();

server.listen(
    {
        port: envVariables.APP_PORT || 8080,
        host: envVariables.APP_HOST || "0.0.0.0",
    },
    (err, address) => {
        if (err) {
            console.error(err);
            server.pg.pool.end();
            server.redis.disconnect();
            server.mqtt.end();
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    },
);
