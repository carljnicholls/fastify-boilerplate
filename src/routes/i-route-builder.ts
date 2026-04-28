import type { FastifyInstance } from "fastify";

// export interface IRouteBuilder {
//     build(fastify: FastifyInstance): void;
// }
export type IRouteBuilder = {
    build(fastify: FastifyInstance): void;
}