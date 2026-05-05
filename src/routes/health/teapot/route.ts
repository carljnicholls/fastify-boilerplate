import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { teapotHandler } from "../../../handlers/teapot.js";

export default async function (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
): Promise<void> {
    fastify.get(
        "/",
        {
            schema: {
                response: {
                    418: {
                        type: "string",
                        description:
                            "https://www.rfc-editor.org/rfc/rfc9110#section-15.5.19",
                        example: "I'm a teapot",
                    },
                },
                description: "Teapot",
                tags: ["health"],
            },
        },
        teapotHandler,
    );
}
