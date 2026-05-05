import {
    userDeleteHandler,
    userGetHandler,
    userPostHandler,
    userPutHandler,
} from "../../handlers/user.js";
import { mqttResponseHook } from "../../hooks/mqtt-response-hook.js";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
): Promise<void> {
    fastify.get(
        "/:id",
        {
            schema: {
                params: fastify.getSchema('idParam'),
                response: {
                    200: fastify.getSchema('user'),
                    // 200: Type.Ref("user#"),
                    404: fastify.getSchema('error'),
                },
                description: "Gets a user for a given id",
                tags: ["user"],
            },
        },
        userGetHandler,
    );
    fastify.post(
        "/",
        {
            schema: {
                body: fastify.getSchema('userWithPassword'),
                response: {
                    200: fastify.getSchema('user'),
                    404: fastify.getSchema('error'),
                },
                description:
                    "Create a user if it doesn't exist. Email and Username must be unique.",
                tags: ["user"],
            },
            onResponse: mqttResponseHook,
        },
        userPostHandler,
    );
    fastify.put(
        "/:id",
        {
            schema: {
                params: fastify.getSchema('idParam'),
                body: fastify.getSchema('user'),
                response: {
                    200: fastify.getSchema('user'),
                    404: fastify.getSchema('error'),
                },
                description: "Update the user with the ID specified in the URL",
                tags: ["user"],
            },
            onResponse: mqttResponseHook,
        },
        userPutHandler,
    );
    fastify.delete(
        "/:id",
        {
            schema: {
                params: fastify.getSchema('idParam'),
                response: {
                    200: fastify.getSchema('user'),
                    404: fastify.getSchema('error'),
                },
                description: "Delete the user with the ID specified in the URL",
                tags: ["user"],
            },
            onResponse: mqttResponseHook,
        },
        userDeleteHandler,
    );
}
