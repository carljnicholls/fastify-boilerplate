import { test, expect, vitest, describe } from 'vitest';
import { teapotHandler } from '../../handlers/teapot';
import { FastifyReply, FastifyRequest } from 'fastify';

describe('teapotHandler', () => {
    test('should return 418 I\'m a teapot status code with text/plain Content-Type', async () => {
        const mockRequest = {} as FastifyRequest;
        const mockReply = {
            status: vitest.fn().mockReturnThis(),
            header: vitest.fn().mockReturnThis(),
            send: vitest.fn(),
        } as unknown as FastifyReply;

        await teapotHandler(mockRequest, mockReply);

        expect(mockReply.status).toHaveBeenCalledWith(418);
        expect(mockReply.header).toHaveBeenCalledWith("Content-Type", "text/plain");
        expect(mockReply.send).toHaveBeenCalledWith("I'm a teapot");
    });
});
