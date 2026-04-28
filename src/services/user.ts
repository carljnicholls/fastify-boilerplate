import type { FastifyRedis } from "@fastify/redis";
import type { IUsersRepository } from "../repository/i-user-repository.js";
import type { User, UserWithPassword } from "../schemas/user.js";

const getRedisKey = (userId: string) => {
    return `user:${userId}`;
};

export const getUser = async (
    redis: FastifyRedis,
    repo: IUsersRepository,
    userId: string,
): Promise<User> => {
    const redisKey = getRedisKey(userId);
    const redisResult = await redis.get(redisKey);
    console.log("redisResult", redisResult);
    if (redisResult) return JSON.parse(redisResult) as User;

    const dbResult = (await repo.get(userId)) as User;
    console.log("dbResult", dbResult);

    await redis.set(redisKey, JSON.stringify(dbResult), "EX", 10);
    return dbResult;
};

export const postUser = async (
    redis: FastifyRedis,
    repo: IUsersRepository,
    user: UserWithPassword,
): Promise<User> => {
    const res = await repo.create(user);
    await redis.set(`user:${res.user_id}`, JSON.stringify(res), "EX", 10);
    return res;
};

export const updateUser = async (
    redis: FastifyRedis,
    repo: IUsersRepository,
    user: User,
): Promise<User> => {
    const redisKey = getRedisKey(user.user_id!);
    await redis.del(redisKey);
    const res = await repo.update(user);
    await redis.set(redisKey, JSON.stringify(res), "EX", 10);
    return res;
};

export const deleteUser = async (
    redis: FastifyRedis,
    repo: IUsersRepository,
    userId: string,
): Promise<User> => {
    await redis.del(getRedisKey(userId));
    const res = await repo.delete(userId);
    return res;
};
