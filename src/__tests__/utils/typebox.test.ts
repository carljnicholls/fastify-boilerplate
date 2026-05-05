import { afterAll, expect, test, describe, it, beforeEach } from 'vitest'
import { isTypeBoxObject } from "../../utils/type-box";
import { Kind } from "@sinclair/typebox";

describe("isTypeBoxObject", () => {
    describe("returns false for non-object types", () => {
        it("should return false for null", () => {
            expect(isTypeBoxObject(null)).toBe(false);
        });

        it("should return false for undefined", () => {
            expect(isTypeBoxObject(undefined)).toBe(false);
        });

        it("should return false for string", () => {
            expect(isTypeBoxObject("string")).toBe(false);
        });

        it("should return false for number", () => {
            expect(isTypeBoxObject(123)).toBe(false);
        });

        it("should return false for boolean", () => {
            expect(isTypeBoxObject(true)).toBe(false);
        });

        it("should return false for function", () => {
            expect(isTypeBoxObject(() => {})).toBe(false);
        });
    });

    describe("returns false for objects missing required properties", () => {
        it("should return false for empty object", () => {
            expect(isTypeBoxObject({})).toBe(false);
        });

        it("should return false for object with only $id", () => {
            expect(isTypeBoxObject({ $id: "test" })).toBe(false);
        });

        it("should return false for object with only Kind", () => {
            expect(isTypeBoxObject({ [Kind]: "String" })).toBe(false);
        });

        it("should return false for object with neither $id nor Kind", () => {
            expect(isTypeBoxObject({ name: "test" })).toBe(false);
        });
    });

    describe("returns true for valid TypeBox objects", () => {
        it("should return true for object with $id and Kind", () => {
            expect(
                isTypeBoxObject({ $id: "TestSchema", [Kind]: "String" }),
            ).toBe(true);
        });

        it("should return true for object with $id, Kind, and additional properties", () => {
            expect(
                isTypeBoxObject({
                    $id: "TestSchema",
                    [Kind]: "String",
                    type: "string",
                    minLength: 5,
                }),
            ).toBe(true);
        });

        it("should return true for object with Kind as Symbol", () => {
            const schema = {
                $id: "Test",
                [Symbol.for("TypeBox.Kind")]: "Number",
            };
            expect(isTypeBoxObject(schema)).toBe(true);
        });
    });

    describe("returns false for arrays", () => {
        it("should return false for empty array", () => {
            expect(isTypeBoxObject([])).toBe(false);
        });

        it("should return false for array with $id and Kind", () => {
            expect(isTypeBoxObject([{ $id: "test", [Kind]: "String" }])).toBe(
                false,
            );
        });
    });
});
