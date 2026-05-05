import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
): Promise<void> {
    fastify.get(
        "/",
        {
            schema: {
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: {
                                type: "string",
                                description: "Health status",
                                example: "ok",
                            },
                        },
                    }
                },
                description: "Health check",
                tags: ["health"],
            },
        },
        async () => {
            return { status: "ok" };
        },
    );
}
