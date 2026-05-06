export class MockRedis {
    private store: Map<string, string> = new Map();

    public set(key: string, value: string): string {
        this.store.set(key, value);
        return "OK";
    }

    public get(key: string): string | null {
        return this.store.get(key) || null;
    }

    public del(key: string): number {
        if (this.store.has(key)) {
            this.store.delete(key);
            return 1; // Mocking the DEL command to always return 1
        }
        return 0;
    }

    public exists(key: string): boolean {
        return this.store.has(key);
    }
}
