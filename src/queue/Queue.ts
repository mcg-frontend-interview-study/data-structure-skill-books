import {ActionHasResultStatusCode, STATUS_CODE} from '../constants/statusCode';

class QueueNode<T> {
  public next: QueueNode<T> | null;
  public prev: QueueNode<T> | null;
  public value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export class Queue<T> {
  private _head: QueueNode<T> | null;
  private _tail: QueueNode<T> | null;
  private _size: number = 0;

  constructor() {}

  add = (value: T) => {
    const node = new QueueNode(value);

    if (this._size == 0) {
      this._head = node;
      this._tail = node;
    } else {
      if (!this._tail) throw new Error('사이즈가 0이 아닌데 _tail이 null입니다.');

      this._tail.next = node;
      node.prev = this._tail;
      this._tail = node;
    }

    this._size += 1;
  };

  addFront = (value: T) => {
    const node = new QueueNode(value);

    if (this._size == 0) {
      this._head = node;
      this._tail = node;
    } else {
      if (!this._head) throw new Error('사이즈가 0이 아닌데 _head null입니다.');

      this._head.prev = node;
      node.next = this._head;
      this._head = node;
    }

    this._size += 1;
  };

  pop = (): ActionHasResultStatusCode<T> => {
    if (this._size == 0) {
      return STATUS_CODE.FAIL;
    }

    // 사이즈가 1인 경우
    if (this._head !== null && this._tail === this._head) {
      const nodeToPop = this._head;

      this._head = null;
      this._tail = null;

      this._size = 0;

      return nodeToPop.value;
    }

    if (!this._tail) {
      throw new Error('사이즈가 0이 아닌데 _tail null입니다.');
    }

    const valueToPop = this._tail.value;
    const prevNode = this._tail.prev;

    if (!prevNode) {
      throw new Error('이전 노드가 없음.');
    }

    prevNode.next = null;
    this._tail = prevNode;
    this._size -= 1;

    return valueToPop;
  };

  popFront = (): ActionHasResultStatusCode<T> => {
    if (this._size == 0) {
      return STATUS_CODE.FAIL;
    }

    // 사이즈가 1인 경우
    if (this._head !== null && this._tail === this._head) {
      const nodeToPop = this._head;

      this._head = null;
      this._tail = null;

      this._size = 0;

      return nodeToPop.value;
    }

    if (!this._head) {
      throw new Error('사이즈가 0이 아닌데 _head null입니다.');
    }

    const valueToPop = this._head.value;
    const nextNode = this._head.next;

    if (!nextNode) {
      throw new Error('이후 노드가 없음.');
    }

    nextNode.prev = null;
    this._head = nextNode;
    this._size -= 1;

    return valueToPop;
  };

  getSize = () => {
    return this._size;
  };

  isEmpty = () => {
    return this._size === 0;
  };
}
