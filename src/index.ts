import fastify from "fastify";
import cors from "@fastify/cors";
import env from "@fastify/env";
import envSchema from "./schemas/env.json" with { type: "json" };
import { corsSettings } from "./constants/cors.js";
import RouteBuilder from "./routes/router-builder.js";
import { UserRepository } from "./repository/users-repository.js";
import fastifyRedis from "@fastify/redis";
import addFormats from "ajv-formats";
import { fastifyPostgres } from "@fastify/postgres";
import packageJson from "../package.json" with { type: "json" };
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const server = fastify({
    logger: {
        level: "info",
        // file: "./logs/server.log",
    },
    ajv: {
        plugins: [[addFormats, { mode: "fast" }] as any],
    },
}).withTypeProvider<TypeBoxTypeProvider>();;

await server.register(import("@fastify/swagger"), {
        openapi: {
            openapi: '3.1.1',
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
    schema: envSchema,
    dotenv: true,
    confKey: "config",
});

await server.register(cors, corsSettings);

await server.register(fastifyPostgres, {
    connectionString: "postgres://user:postgres@localhost:5432/boilerplate_db",
});
await server.after();
server.decorate("usersRepository", new UserRepository(server.pg.pool));

RouteBuilder.build(server, { prefix: "/api/v1" });

await server.register(fastifyRedis, {
    url: "redis://localhost:6379",
});

await server.ready();
server.swagger();

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        server.redis.disconnect();
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
