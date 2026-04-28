import { FastifyRedis } from "@fastify/redis";
import { IUsersRepository } from "../interfaces/IUsersRepository";

declare module "fastify" {
    interface FastifyInstance {
        usersRepository: IUsersRepository;
        redis: FastifyRedis;
    }
}
