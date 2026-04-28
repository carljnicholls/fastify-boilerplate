import type { FastifyReply, FastifyRequest } from "fastify";

export const teapotHandler = async (
    _request: FastifyRequest,
    reply: FastifyReply,
) => {
    await reply.status(418).header("Content-Type", "text/plain").send("I'm a teapot");
};
