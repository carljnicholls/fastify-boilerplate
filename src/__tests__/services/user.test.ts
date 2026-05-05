import { afterAll, expect, test, describe, it, beforeEach, beforeAll, vi } from 'vitest'

import { deleteUser, getUser, postUser, updateUser } from "../../services/user";
import type { FastifyRedis } from "@fastify/redis";
import type { IUsersRepository } from "../../repository/i-user-repository";
import type { User } from "../../schemas/public/user";
import type { UserWithPassword } from "../../schemas/public/user-with-password";

const mockUser = {
    user_id: "123",
    username: "test",
} as User;
let mockRedis: FastifyRedis;
let mockRepo: IUsersRepository;

describe("user", () => {
    beforeAll(() => {
    });

    describe("getUser", () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it("should get a user from redis if they are cached", async () => {
            mockRedis = {
                get: vi
                    .fn<() => Promise<string>>()
                    .mockResolvedValue(JSON.stringify(mockUser)),
            } as unknown as FastifyRedis;
            mockRepo = {
                get: vi.fn<() => Promise<User>>().mockResolvedValue(mockUser),
            } as unknown as IUsersRepository;
            expect(await getUser(mockRedis, mockRepo, "123")).toMatchObject(
                mockUser,
            );
            expect(mockRedis.get).toHaveBeenCalledWith("user:123");
            expect(mockRepo.get).not.toHaveBeenCalled();
        });

        it("should get a user from db if not cached in redis", async () => {
            mockRedis = {
                get: vi
                    .fn<() => Promise<string | null>>()
                    .mockResolvedValue(null),
                set: vi.fn<() => Promise<string>>().mockResolvedValue("OK"),
            } as unknown as FastifyRedis;
            mockRepo = {
                get: vi.fn<() => Promise<User>>().mockResolvedValue(mockUser),
            } as unknown as IUsersRepository;
            expect(await getUser(mockRedis, mockRepo, "123")).toMatchObject(
                mockUser,
            );
            expect(mockRedis.get).toHaveBeenCalledWith("user:123");
            expect(mockRepo.get).toHaveBeenCalledWith("123");
            expect(mockRedis.set).toHaveBeenCalledWith(
                // @ts-ignore
                "user:123",
                JSON.stringify(mockUser),
                "EX",
                10,
            );
        });
    });

    describe("postUser", () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it("should create a user", async () => {
            const user = {...mockUser} as UserWithPassword
            mockRedis = {
                set: vi.fn<() => Promise<string>>().mockResolvedValue("OK"),
            } as unknown as FastifyRedis;
            mockRepo = {
                create: vi
                    .fn<() => Promise<User>>()
                    .mockResolvedValue(mockUser),
            } as unknown as IUsersRepository;
            const result = await postUser(mockRedis, mockRepo, user);

            expect(mockRepo.create).toHaveBeenCalledWith(user);
            expect(result).toMatchObject(user);
            expect(mockRedis.set).toHaveBeenCalledWith(
                // @ts-ignore
                "user:123",
                JSON.stringify(user),
                "EX",
                10,
            );
        });

        it("should throw if the repository errors", async () => {
            const mockRepo = {
                create: vi
                    .fn<() => Promise<User>>()
                    .mockRejectedValueOnce(
                        new Error(
                            'duplicate key value violates unique constraint "users_username_key"',
                        ),
                    ),
            } as unknown as IUsersRepository;

            await expect(
                postUser(mockRedis, mockRepo, mockUser as UserWithPassword),
            ).rejects.toThrow(
                'duplicate key value violates unique constraint "users_username_key"',
            );
        });
    });

    describe("updateUser", () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it("should update a user", async () => {
            const mockRedis = {
                del: vi.fn<() => Promise<number>>().mockResolvedValue(1),
                set: vi.fn<() => Promise<string>>().mockResolvedValue("OK"),
            } as unknown as FastifyRedis;
            const mockRepo = {
                update: vi
                    .fn<() => Promise<User>>()
                    .mockResolvedValue(mockUser),
            } as unknown as IUsersRepository;
            const result = await updateUser(mockRedis, mockRepo, mockUser);

            expect(mockRedis.del).toHaveBeenCalledWith("user:123");
            expect(mockRepo.update).toHaveBeenCalledWith(mockUser);
            expect(mockRedis.set).toHaveBeenCalledWith(
                // @ts-ignore
                "user:123",
                JSON.stringify(mockUser),
                "EX",
                10,
            );
            expect(result).toBe(mockUser);
        });

        it("should throw if the repository errors", async () => {
            mockRedis = {
                del: vi.fn<() => Promise<number>>().mockResolvedValue(1),
                set: vi.fn<() => Promise<string>>().mockResolvedValue("OK"),
            } as unknown as FastifyRedis;
            mockRepo = {
                update: vi
                    .fn<() => Promise<User>>()
                    .mockRejectedValueOnce(new Error("DB Error")),
            } as unknown as IUsersRepository;

            await expect(
                updateUser(mockRedis, mockRepo, mockUser),
            ).rejects.toThrow("DB Error");
        });
    });

    describe("deleteUser", () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it("should delete a user", async () => {
            mockRedis = {
                del: vi.fn<() => Promise<number>>().mockResolvedValue(1),
            } as unknown as FastifyRedis;

            mockRepo = {
                delete: vi
                    .fn<() => Promise<User>>()
                    .mockResolvedValue(mockUser),
            } as unknown as IUsersRepository;

            const result = await deleteUser(mockRedis, mockRepo, "123");

            expect(mockRedis.del).toHaveBeenCalledWith("user:123");
            expect(mockRepo.delete).toHaveBeenCalledWith("123");
            expect(result).toBe(mockUser);
        });

        it("should throw if the repository errors", async () => {
            mockRedis = {
                del: vi.fn<() => Promise<number>>().mockResolvedValue(1),
            } as unknown as FastifyRedis;

            mockRepo = {
                delete: vi
                    .fn<() => Promise<User>>()
                    .mockRejectedValueOnce(new Error("DB Error")),
            } as unknown as IUsersRepository;

            await expect(
                deleteUser(mockRedis, mockRepo, "123"),
            ).rejects.toThrow("DB Error");
        });
    });
});
