import createError from "@fastify/error";

export const UserNotFoundError = createError(
    "FST_USER_NOT_FOUND",
    "User with id %s was not found",
    404,
);

// export class UserNotFoundError extends Error {
//     constructor(message: string) {
//         super(message);
//         this.name = "UserNotFoundError";
//     }
// }
