import { FastifyRedis } from "@fastify/redis";
import { IUsersRepository } from "../interfaces/IUsersRepository";
import { EnvSchema, type Env } from "./schemas/env.js";

declare module "fastify" {
    interface FastifyInstance {
        redis: FastifyRedis;
        config: EnvSchema;
    }
    interface FastifyReply {
        mqtt?: {
            options?: IClientSubscribeOptions,
            payload: string | Buffer;
        }
    }
}
