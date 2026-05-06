import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userGetHandler, userPostHandler, userPutHandler, userDeleteHandler } from '../../handlers/user';
import { MockRedis } from '../../__mocks__/redis/redis'

import { FastifyRequest, FastifyReply, FastifyInstance, FastifyBaseLogger } from 'fastify';
import { FastifyRedis } from '@fastify/redis';
import { IUsersRepository } from '../../repository/i-user-repository';


const mockGetUser = vi.hoisted(() => vi.fn());
const mockPostUser = vi.hoisted(() => vi.fn());
const mockUpdateUser = vi.hoisted(() => vi.fn());
const mockDeleteUser = vi.hoisted(() => vi.fn());
const mockSetReplyMqtt = vi.hoisted(() => vi.fn());

const mockUserRepo = {
    get: mockGetUser,
    create: mockPostUser,
    update: mockUpdateUser,
    delete: mockDeleteUser,
} as IUsersRepository;

vi.mock('../../utils/repo', () => ({
    getRepository: vi.fn(() => mockUserRepo),
}));

vi.mock('../../services/user', () => ({
    getUser: mockGetUser,
    postUser: mockPostUser,
    updateUser: mockUpdateUser,
    deleteUser: mockDeleteUser,
}));

vi.mock('../../utils/mqtt', () => ({
    setReplyMqtt: mockSetReplyMqtt,
}));

const createMockReply = () => ({
    log: {
        debug: vi.fn(),
    } as unknown as FastifyBaseLogger,
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
});

const createMockRequest = (overrides: Partial<FastifyRequest> = {}): Partial<FastifyRequest> => ({
    params: { id: '123' },
    server: {
        redis: new MockRedis() as unknown as FastifyRedis,
        get: vi.fn(),
    } as unknown as FastifyInstance,
    ...overrides,
});

describe('User Handlers', () => {
    let mockReply: Partial<FastifyReply>;
    let mockRequest: Partial<FastifyRequest>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSetReplyMqtt.mockResolvedValue(undefined);
        mockReply = createMockReply();
        mockRequest = createMockRequest();
    });

    describe('userGetHandler', () => {
        const mockUser = { user_id: '123', name: 'Test User' };
        
        beforeEach(() => {
            mockGetUser.mockResolvedValue(mockUser);
        });

        it('should call getUser with correct parameters', async () => {
            await userGetHandler(mockRequest as FastifyRequest, mockReply as FastifyReply);

            expect(mockGetUser).toHaveBeenCalledWith(
                mockRequest.server!.redis,
                mockUserRepo,
                (mockRequest.params as any).id,
            );
        });

        it('should send 200 status with user data', async () => {
            await userGetHandler(mockRequest as FastifyRequest, mockReply as FastifyReply);

            expect(mockReply.status).toHaveBeenCalledWith(200);
            expect(mockReply.send).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('userPostHandler', () => {
        const mockUser = { name: 'New User', email: 'new@example.com' };
        const mockResponse = { user_id: '456', ...mockUser };

        beforeEach(() => {
            mockPostUser.mockResolvedValue(mockResponse);
        });

        it('should call postUser with correct parameters', async () => {
            const requestWithBody = { ...mockRequest as FastifyRequest, body: mockUser };

            await userPostHandler(requestWithBody as FastifyRequest, mockReply as FastifyReply);

            expect(mockPostUser).toHaveBeenCalledWith(
                requestWithBody.server.redis,
                mockUserRepo,
                mockUser,
            );
        });

        it('should send MQTT notification with correct topic', async () => {
            const requestWithBody = { ...mockRequest as FastifyRequest, body: mockUser };

            await userPostHandler(requestWithBody as FastifyRequest, mockReply as FastifyReply);

            expect(mockSetReplyMqtt).toHaveBeenCalledWith(
                `api/v1/users/${mockResponse.user_id}/create`,
                mockReply,
                mockResponse,
            );
        });

        it('should send 201 status with response data', async () => {
            const requestWithBody = { ...mockRequest as FastifyRequest, body: mockUser };

            await userPostHandler(requestWithBody as FastifyRequest, mockReply as FastifyReply);

            expect(mockReply.status).toHaveBeenCalledWith(201);
            expect(mockReply.send).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('userPutHandler', () => {
        const mockUser = { user_id: '123', name: 'Updated User', email: 'updated@example.com' };
        const mockResponse = { user_id: '123', name: 'Updated User', email: 'updated@example.com' };

        beforeEach(() => {
            mockUpdateUser.mockResolvedValue(mockResponse);
        });

        it('should call updateUser with correct parameters', async () => {
            const requestWithBody = { ...mockRequest as FastifyRequest, body: mockUser };

            await userPutHandler(requestWithBody as FastifyRequest, mockReply as FastifyReply);

            expect(mockUpdateUser).toHaveBeenCalledWith(
                requestWithBody.server.redis,
                mockUserRepo,
                mockUser,
            );
        });

        it('should send MQTT notification with correct topic', async () => {
            const requestWithBody = { ...mockRequest as FastifyRequest, body: mockUser };

            await userPutHandler(requestWithBody as FastifyRequest, mockReply as FastifyReply);

            expect(mockSetReplyMqtt).toHaveBeenCalledWith(
                `api/v1/users/${mockResponse.user_id}/update`,
                mockReply,
                mockResponse,
            );
        });

        it('should send 200 status with response data', async () => {
            const requestWithBody = { ...mockRequest as FastifyRequest, body: mockUser };

            await userPutHandler(requestWithBody as FastifyRequest, mockReply as FastifyReply);

            expect(mockReply.status).toHaveBeenCalledWith(200);
            expect(mockReply.send).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('userDeleteHandler', () => {
        const mockResponse = { user_id: '123', deleted: true };

        beforeEach(() => {
            mockDeleteUser.mockResolvedValue(mockResponse);
        });

        it('should call deleteUser with correct parameters', async () => {
            const requestWithParams = { ...mockRequest as FastifyRequest, params: { id: '123' } };

            await userDeleteHandler(requestWithParams as FastifyRequest, mockReply as FastifyReply);

            expect(mockDeleteUser).toHaveBeenCalledWith(
                requestWithParams.server.redis,
                mockUserRepo,
                requestWithParams.params.id,
            );
        });

        it('should send MQTT notification with correct topic', async () => {
            const requestWithParams = { ...mockRequest as FastifyRequest, params: { id: '123' } };

            await userDeleteHandler(requestWithParams as FastifyRequest, mockReply as FastifyReply);

            expect(mockSetReplyMqtt).toHaveBeenCalledWith(
                `api/v1/users/${mockResponse.user_id}/delete`,
                mockReply,
                mockResponse,
            );
        });

        it('should send 200 status with response data', async () => {
            const requestWithParams = { ...mockRequest as FastifyRequest, params: { id: '123' } };

            await userDeleteHandler(requestWithParams as FastifyRequest, mockReply as FastifyReply);

            expect(mockReply.status).toHaveBeenCalledWith(200);
            expect(mockReply.send).toHaveBeenCalledWith(mockResponse);
        });
    });
});