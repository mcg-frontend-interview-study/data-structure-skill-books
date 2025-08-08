/**
 * 우선순위 커스텀을 할 수 있는 우큐
 * insert
 * delete
 * top
 * is_empty()
 * size()
 */

import {Comparator, COMPARISON_RESULT} from '../bst/utils/comparator';

type Order = 'asc' | 'desc';

export class PriorityQueue<T> {
  private _comparator: Comparator<T>;
  private _order: Order;

  private _heap: T[];

  constructor(comparator: Comparator<T>, order: Order = 'desc') {
    this._comparator = comparator;
    this._order = order;

    this._heap = [];
  }

  isEmpty() {
    return this._heap.length <= 0;
  }

  getSize() {
    return this._heap.length;
  }

  insert(value: T) {
    if (this.getSize() <= 0) {
      this._heap.push(value);
      return;
    }

    this._heap.push(value);
    this._bubbleUp();
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    const nodeToPop = this._heap[0];

    const lastNode = this._heap[this._heap.length - 1];
    this._heap[0] = lastNode;
    this._heap.pop();

    if (this._heap.length === 1) {
      return nodeToPop;
    }

    this._bubbleDown();

    return nodeToPop;
  }

  // 보기만 한다.
  top() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._heap[0];
  }

  private _getParentIndex(index: number) {
    return Math.ceil(index / 2) - 1;
  }

  private _getChildrenIndexes(index: number) {
    return [index * 2 + 1, index * 2 + 2];
  }

  private _bubbleDown() {
    let targetIndex = 0;
    const heapSize = this.getSize();

    // 자식이 더 높다면 그거랑 교환한다.
    while (true) {
      let [leftChildIndex, rightChildIndex] = this._getChildrenIndexes(targetIndex);
      let highPriorityIndex = targetIndex;

      if (leftChildIndex < heapSize && this._isHighPriority(leftChildIndex, targetIndex)) {
        highPriorityIndex = leftChildIndex;
      }

      if (rightChildIndex < heapSize && this._isHighPriority(rightChildIndex, highPriorityIndex)) {
        highPriorityIndex = rightChildIndex;
      }

      if (highPriorityIndex === targetIndex) {
        break;
      }

      this._swap(highPriorityIndex, targetIndex);
      targetIndex = highPriorityIndex;
    }
  }

  // 내림차순인 경우 자식이 부모보다 클 경우 교환한다.
  private _bubbleUp() {
    let targetIndex = this._heap.length - 1;
    let parentIndex = this._getParentIndex(targetIndex);

    while (true) {
      const needSwap = this._isHighPriority(targetIndex, parentIndex);

      if (needSwap) {
        this._swap(targetIndex, parentIndex);

        const newParentIndex = this._getParentIndex(parentIndex);

        if (newParentIndex <= -1) {
          break;
        }

        targetIndex = parentIndex;
        parentIndex = newParentIndex;
      } else {
        break;
      }
    }
  }

  private _swap(aIndex: number, bIndex: number) {
    [this._heap[aIndex], this._heap[bIndex]] = [this._heap[bIndex], this._heap[aIndex]];
  }

  private _isHighPriority(aIndex: number, bIndex) {
    const comparisonResult = this._comparator(this._heap[aIndex], this._heap[bIndex]);

    if (this._order === 'desc') {
      return comparisonResult === COMPARISON_RESULT.GREATER_THAN;
    } else {
      return comparisonResult === COMPARISON_RESULT.LESS_THAN;
    }
  }
}
