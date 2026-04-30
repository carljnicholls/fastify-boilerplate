import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { IUsersRepository } from "../repository/i-user-repository.js";
import { deleteUser, getUser, postUser, updateUser } from "../services/user.js";
import { getRepository } from "../utils/repo.js";
import { type User, type UserWithPassword } from "../schemas/user.js";
import type { IdParam } from "../schemas/query/id.js";

const getUserRepo = (request: FastifyInstance) => {
    return getRepository<IUsersRepository>(request, "usersRepository");
};

export const userGetHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const { id } = request.params as IdParam;
    const user = await getUser(
        request.server.redis,
        getUserRepo(request.server),
        id,
    );
    reply.log.debug(user);

    await reply.status(200).send(user);
};

export const userPostHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const user = request.body as UserWithPassword;

    const res = await postUser(
        request.server.redis,
        getUserRepo(request.server),
        user,
    );

    reply.status(200).send(res);
};

export const userPutHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const { id } = request.params as IdParam;
    const user = request.body as User;
    if (!user.user_id) user.user_id = id;

    const res = await updateUser(
        request.server.redis,
        getUserRepo(request.server),
        user,
    );

    reply.status(200).send(res);
};

export const userDeleteHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const { id } = request.params as IdParam;
    const res = await deleteUser(
        request.server.redis,
        getUserRepo(request.server),
        id,
    );
    reply.status(200).send(res);
};
