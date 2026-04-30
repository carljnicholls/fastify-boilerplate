import { FastifyRedis } from "@fastify/redis";
import { IUsersRepository } from "../interfaces/IUsersRepository";
import { EnvSchema, type Env} from "./schemas/env.js";

declare module "fastify" {
    interface FastifyInstance {
        usersRepository: IUsersRepository;
        redis: FastifyRedis;
        config: EnvSchema
    }
}
