import type { FastifyPluginAsync } from "fastify";
import {
    userDeleteHandler,
    userGetHandler,
    userPostHandler,
    userPutHandler,
} from "../handlers/user.js";
import { UserPasswordSchema as UserWithPasswordSchema, UserSchema } from "../schemas/user.js";
import { IdParamSchema } from "../schemas/query/id.js";
import { ErrorSchema } from "../schemas/error.js";

export const userPlugin: FastifyPluginAsync = async (fastify, _options) => {
    fastify.get(
        "/user/:id",
        {
            schema: {
                params: IdParamSchema,
                response: {
                    200: UserSchema,
                    404: ErrorSchema
                },
                description: "Gets a user for a given id",
                tags: ["user"]
            },
        },
        userGetHandler,
    );
    fastify.post(
        "/user",
        {
            schema: {
                body: UserWithPasswordSchema,
                response: {
                    200: UserSchema,
                    500: ErrorSchema
                },
                description: "Create a user if it doesn't exist. Email and Username must be unique.",
                tags: ["user"]
            },
        },
        userPostHandler,
    );
    fastify.put(
        "/user/:id",
        {
            schema: {
                params: IdParamSchema,
                body: UserSchema,
                response: {
                    200: {
                        $schema: UserSchema.$schema
                    },
                    // 200: UserSchema,
                    404: ErrorSchema
                }, 
                description: "Update the user with the ID specified in the URL",
                tags: ["user"],
            },
        },
        userPutHandler,
    );
    fastify.delete(
        "/user/:id",
        {
            schema: {
                params: IdParamSchema,
                response: {
                    200: {
                        $schema: UserSchema.$schema
                    },
                    404: ErrorSchema
                },
                description: "Delete the user with the ID specified in the URL",
                tags: ["user"],
            },
        },
        userDeleteHandler,
    );
};
