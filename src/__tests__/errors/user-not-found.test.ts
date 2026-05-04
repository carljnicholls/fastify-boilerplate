import { describe, it, expect, jest, beforeEach } from "@jest/globals";

import { UserNotFoundError } from '../../errors/user-not-found.js'; 

describe('UserNotFoundError', () => {
    it('should create an error with the correct properties', () => {
        const userId = '12345';
        const error = new UserNotFoundError(userId);

        expect(error.code).toBe('FST_USER_NOT_FOUND');
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(`User with id ${userId} was not found`);
    });


    it('should handle different data types for the ID placeholder', () => {
        const error = new UserNotFoundError(99);
        expect(error.message).toBe('User with id 99 was not found');
    });

    it('should handle different data types for the ID placeholder', () => {
        const error = new UserNotFoundError({test: 'pass'});
        expect(error.message).toBe('User with id { test: \'pass\' } was not found');
    });
});