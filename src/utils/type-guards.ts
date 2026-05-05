
/**
 * Converts a value to a string or Buffer
 * @param val The value to convert
 * @returns Stringified object, Buffer, or an empty string
 */
export const toStringOrBuffer = (val: unknown): string | Buffer => {
    if (typeof val === "string" || Buffer.isBuffer(val)) {
        return val;
    }

    if (val == null) {
        return "";
    }

    if (typeof val === "object") {
        try {
            return JSON.stringify(val, (_key, value) => {
                if (typeof value === "bigint") return value.toString();
                if (value instanceof Date) return value.toISOString();
                return value;
            });
        } catch (error) {
            // If circular reference etc 
            // return a default value
            return `[Serialization Error: ${error instanceof Error ? error.message : "Unknown"}]`;
        }
    }

    return String(val);
};
