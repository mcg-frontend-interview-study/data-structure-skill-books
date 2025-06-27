import { ActionStatusCode } from '../constants/statusCode';
export declare class KeyObjectSet<T extends Record<string | number, any>> {
    private key;
    private keySet;
    private dataMap;
    constructor(list: T[], key: keyof T);
    get size(): number;
    find(value: T[keyof T]): T | undefined;
    has(value: T[keyof T]): boolean;
    add(item: T): ActionStatusCode;
    delete(value: T[keyof T]): ActionStatusCode;
    values(): T[];
    private checkKeyObjectSet;
    private checkSameKey;
    intersection(otherSet: KeyObjectSet<T>): KeyObjectSet<T>;
    difference(otherSet: KeyObjectSet<T>): KeyObjectSet<T>;
    union(otherSet: KeyObjectSet<T>): KeyObjectSet<T>;
}
