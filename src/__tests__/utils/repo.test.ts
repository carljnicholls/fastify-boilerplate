import { afterAll, expect, test, describe, it, beforeEach, vi } from 'vitest'
import { getRepository } from '../../utils/repo';
import type { IUsersRepository } from '../../repository/i-user-repository';
import type { FastifyInstance } from 'fastify';

describe('repo', () => {
    describe('getRepository', () => {
        it('should throw when decorator (repo) is not found', () => {
            const mockFastify = {
                getDecorator: vi.fn().mockReturnValue(null)
            } as unknown as FastifyInstance;

            expect(() => getRepository<IUsersRepository>(mockFastify, 'usersRepository')).toThrow("No repository found");
        });

        it('should return the repository when found', () => {
            const mockRepo = {} as IUsersRepository;
            const mockFastify = {
                getDecorator: vi.fn().mockReturnValue(mockRepo)
            } as unknown as FastifyInstance;

            const result = getRepository<IUsersRepository>(mockFastify, 'usersRepository');
            expect(result).toBe(mockRepo);
        });
    });
});