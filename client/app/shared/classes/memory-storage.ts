import { InjectionToken } from '@angular/core';

export const SESSION_STORAGE = new InjectionToken<SimpleStorage>('Session storage that will be shimed when running on server');

/**
 * Normal Storage type, but without array access
 */
export type SimpleStorage = Pick<Storage, 'length' | 'clear' | 'getItem' | 'key' | 'removeItem' | 'setItem'>;

/**
 * Memory storage to keep store volatile things in memory
 *
 * Should be used to shim sessionStorage when running on server or in our tests
 */
export class MemoryStorage implements SimpleStorage {
    private readonly data = new Map<string, string>();

    public get length(): number {
        return this.data.size;
    }

    public clear(): void {
        this.data.clear();
    }

    public getItem(key: string): string | null {
        const value = this.data.get(key);
        return value === undefined ? null : value;
    }

    public key(index: number): string | null {
        return this.data.keys()[index];
    }

    public removeItem(key: string): void {
        this.data.delete(key);
    }

    public setItem(key: string, value: string): void {
        this.data.set(key, value);
    }
}

