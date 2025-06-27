import { ActionStatusCode } from '../constants/statusCode';
export declare class BSTNode<T> {
    private _value;
    private _parent;
    private _left;
    private _right;
    private _existCount;
    constructor(value: T);
    getValue(): T;
    setValue(value: T): void;
    getParent(): BSTNode<T> | null;
    setParent(node: BSTNode<T>): void;
    clearParent(): void;
    getLeft(): BSTNode<T> | null;
    setLeft(node: BSTNode<T>): void;
    clearLeft(): void;
    getRight(): BSTNode<T> | null;
    setRight(node: BSTNode<T>): void;
    clearRight(): void;
    isNotSingle(): boolean;
    getExistCount(): number;
    addExistCount(): void;
    subtractExistCount(): ActionStatusCode;
    isRightEmpty(): boolean;
    isLeftEmpty(): boolean;
    isLeaf(): boolean;
    deleteChild(childNode: BSTNode<T>): ActionStatusCode;
}
