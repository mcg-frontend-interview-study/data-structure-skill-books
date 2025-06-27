/**
 * 실패하는 경우가 있는 메서드의 경우 실패: -1, 성공: 0
 * 에러를 던지지 않는 이유는 자료구조로 인해 프로그램이 중단되지 않도록 하기 위해
 *
 * "없다", "찾을 수 없다" 는 엄격히 다르다. 전자는 null, 후자는 -1
 */
import { ActionStatusCode, FindStatusCode } from '../constants/statusCode';
import { BSTNode } from './BstNode';
import { Comparator } from './utils/comparator';
export declare class BST<T extends any> {
    private _root;
    private _size;
    private _comparator;
    constructor(comparator: Comparator<T>);
    private _getComparator;
    insert(value: T): void;
    insertByRecursion(value: T): void;
    private _insertByRecursion;
    insertByIteration(value: T): void;
    private _insertFirst;
    find(value: T): FindStatusCode<BSTNode<T>>;
    findNodeByIteration(value: T): FindStatusCode<BSTNode<T>>;
    findNodeByRecursion(value: T): FindStatusCode<BSTNode<T>>;
    private _findNodeByRecursion;
    private _clearRoot;
    delete(value: T): ActionStatusCode;
    deleteByIteration(value: T): ActionStatusCode;
    private _deleteByIteration;
    findLargestNodeByIteration(node: BSTNode<T>): BSTNode<T>;
    getSize(): number;
    private _addSize;
    private _subtractSize;
    getRoot(): BSTNode<T> | null;
    private _setRoot;
    traverseInOrderByRecursion(): T[];
    private _traverseInOrderByRecursion;
    traversePreOrderByRecursion(): T[];
    private _traversePreOrderByRecursion;
    traversePostOrderByRecursion(): T[];
    private _traversePostOrderByRecursion;
    printTreeByIteration(rootValue?: T, printFn?: (res: string) => void): ActionStatusCode;
    private _traverseForPrint;
}
