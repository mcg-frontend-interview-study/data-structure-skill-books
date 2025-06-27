import { STATUS_CODE } from '../constants/statusCode';
export class BSTNode {
    _value;
    _parent;
    _left;
    _right;
    _existCount;
    constructor(value) {
        this._value = value;
        this._existCount = 1;
        this._parent = null;
        this._left = null;
        this._right = null;
    }
    getValue() {
        return this._value;
    }
    setValue(value) {
        this._value = value;
    }
    getParent() {
        return this._parent;
    }
    setParent(node) {
        this._parent = node;
    }
    clearParent() {
        this._parent = null;
    }
    getLeft() {
        return this._left;
    }
    setLeft(node) {
        this._left = node;
    }
    clearLeft() {
        this._left = null;
    }
    getRight() {
        return this._right;
    }
    setRight(node) {
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
    subtractExistCount() {
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
    deleteChild(childNode) {
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
