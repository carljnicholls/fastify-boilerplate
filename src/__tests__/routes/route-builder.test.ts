import {
    describe,
    it,
    expect,
    jest,
    beforeAll,
    beforeEach,
} from "@jest/globals";
import RouteBuilder from "../../routes/router-builder";

describe("route-builder", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('build', () => {

        it('should register the correct number of routes', () => {
            const mockFastify = {
                register: jest.fn<() => Promise<void>>()
            }
            const mockOptions = {}

            RouteBuilder.build(mockFastify as any, mockOptions as any)

            expect(mockFastify.register).toHaveBeenCalledTimes(2)
        })
        
    });
});