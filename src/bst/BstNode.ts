import { ActionStatusCode, STATUS_CODE } from "../constants/statusCode";

export class BSTNode<T> {
    private _value: T;

    private _parent: BSTNode<T> | null;
    private _left: BSTNode<T> | null;
    private _right: BSTNode<T> | null;
    private _existCount: number;

    constructor(value: T) {
        this._value = value;
        this._existCount = 1;

        this._parent = null;
        this._left = null;
        this._right = null;
    }

    getValue() {
        return this._value;
    }

    setValue(value: T) {
        this._value = value;
    }

    getParent() {
        return this._parent;
    }

    setParent(node: BSTNode<T>) {
        this._parent = node;
    }

    clearParent() {
        this._parent = null;
    }

    getLeft() {
        return this._left;
    }

    setLeft(node: BSTNode<T>) {
        this._left = node;
    }

    clearLeft() {
        this._left = null;
    }

    getRight() {
        return this._right;
    }

    setRight(node: BSTNode<T>) {
        this._right = node;
    }

    clearRight() {
        this._right = null;
    }

    isNotSingle() {
        return this._existCount > 1;
    }

    getExistCount() {
        return this._existCount;
    }

    addExistCount() {
        this._existCount += 1;
    }

    subtractExistCount(): ActionStatusCode {
        if (this._existCount <= 1) {
            return STATUS_CODE.FAIL;
        }

        this._existCount -= 1;
        return STATUS_CODE.SUCCESS;
    }

    isRightEmpty() {
        return this.getRight() === null;
    }

    isLeftEmpty() {
        return this.getLeft() === null;
    }

    isLeaf() {
        return this.isRightEmpty() && this.isLeftEmpty();
    }

    deleteChild(childNode: BSTNode<T>): ActionStatusCode {
        if (this.getLeft() === childNode) {
            this.clearLeft();
            return STATUS_CODE.SUCCESS;
        }

        if (this.getRight() === childNode) {
            this.clearRight();
            return STATUS_CODE.SUCCESS;
        }

        return STATUS_CODE.FAIL;
    }
}
