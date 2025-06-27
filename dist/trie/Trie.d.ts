import { ActionStatusCode, FindStatusCode } from '../constants/statusCode';
export declare class Trie<T> {
    private root;
    constructor();
    insert(key: string, value: T): ActionStatusCode;
    search(key: string): FindStatusCode<T>;
    delete(key: string): ActionStatusCode;
    private deleteFunc;
}
