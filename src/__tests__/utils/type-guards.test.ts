import {
    describe,
    test,
    expect,
} from "@jest/globals";
import { Buffer } from "buffer";
import { toStringOrBuffer } from "../../utils/type-guards.js";

describe("toStringOrBuffer", () => {
    describe("Direct Pass-through", () => {
        test("should return the same string when input is a string", () => {
            const input = "hello mqtt";
            expect(toStringOrBuffer(input)).toBe(input);
        });

        test("should return the same Buffer when input is a Buffer", () => {
            const input = Buffer.from("binary data");
            const result = toStringOrBuffer(input);
            expect(Buffer.isBuffer(result)).toBe(true);
            expect(result).toEqual(input);
        });
    });

    describe("Nullish Values", () => {
        test("should return an empty string for null", () => {
            expect(toStringOrBuffer(null)).toBe("");
        });

        test("should return an empty string for undefined", () => {
            expect(toStringOrBuffer(undefined)).toBe("");
        });
    });

    describe("Objects and Arrays", () => {
        test("should stringify a standard object", () => {
            const input = { foo: "bar", baz: 123 };
            expect(toStringOrBuffer(input)).toBe(JSON.stringify(input));
        });

        test("should stringify an array", () => {
            const input = [1, "two", { three: true }];
            expect(toStringOrBuffer(input)).toBe(JSON.stringify(input));
        });

        test("should handle BigInt inside an object without throwing", () => {
            const input = { id: BigInt(9007199254740991) };
            const result = toStringOrBuffer(input);
            expect(result).toContain("9007199254740991");
        });

        test("should handle Date objects by converting to ISO string", () => {
            const date = new Date("2026-05-03T12:00:00Z");
            const input = { timestamp: date };
            expect(toStringOrBuffer(input)).toContain("2026-05-03T12:00:00.000Z");
        });
    });

    describe("Safety and Edge Cases", () => {
        test("should catch circular references and return an error string", () => {
            const circular: any = { name: "circular" };
            circular.self = circular;

            const result = toStringOrBuffer(circular);
            expect(typeof result).toBe("string");
            expect(result).toContain("[Serialization Error:");
        });

        test("should convert numbers to strings", () => {
            expect(toStringOrBuffer(42)).toBe("42");
            expect(toStringOrBuffer(0)).toBe("0");
        });

        test("should convert booleans to strings", () => {
            expect(toStringOrBuffer(true)).toBe("true");
            expect(toStringOrBuffer(false)).toBe("false");
        });
    });
});
