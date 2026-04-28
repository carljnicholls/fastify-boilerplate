import type { FastifyInstance } from "fastify";

export const getRepository = <T> (fastify: FastifyInstance, key: string): T => {
    const repo = fastify.getDecorator<T>(key);
    if(!repo) throw new Error("No repository found");
    return repo;
}