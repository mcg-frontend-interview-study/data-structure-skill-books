import {ActionHasResultStatusCode, ActionStatusCode, FindStatusCode, STATUS_CODE} from '../constants/statusCode';

type HeapMode = 'min' | 'max';
type CompareFn<T> = (a: T, b: T) => number;
type KeySelector<T> = (item: T) => number;

type NumberHeapInit<T extends number> = HeapMode | CompareFn<T> | [HeapMode, KeySelector<T>];
type GenericHeapInit<T> = CompareFn<T> | [HeapMode, KeySelector<T>];

type HeapInit<T> = T extends number ? NumberHeapInit<T> : GenericHeapInit<T>;

export class Heap<T> {
  private arr: T[] = [];
  private compareFn: CompareFn<T>;

  constructor(init?: HeapInit<T>) {
    if (typeof init === 'function') {
      // compare function only
      this.compareFn = init;
    } else if (Array.isArray(init)) {
      // mode and compare function
      const [mode, keySelector] = init;
      this.compareFn =
        mode === 'max' ? (a, b) => keySelector(b) - keySelector(a) : (a, b) => keySelector(a) - keySelector(b);
    } else {
      // mode only
      const mode = init ?? 'min';
      this.compareFn =
        mode === 'max'
          ? (a, b) => (b as unknown as number) - (a as unknown as number)
          : (a, b) => (a as unknown as number) - (b as unknown as number);
    }
  }

  private swap(idx1: number, idx2: number) {
    [this.arr[idx1], this.arr[idx2]] = [this.arr[idx2], this.arr[idx1]];
  }

  private bubbleUp() {
    let curIdx = this.size() - 1;
    let parentIdx = Math.floor((curIdx - 1) / 2);

    while (parentIdx >= 0 && this.compareFn(this.arr[curIdx], this.arr[parentIdx]) < 0) {
      this.swap(parentIdx, curIdx);
      curIdx = parentIdx;
      parentIdx = Math.floor((curIdx - 1) / 2);
    }
  }

  private bubbleDown() {
    let curIdx = 0;
    let leftIdx = curIdx * 2 + 1;
    let rightIdx = curIdx * 2 + 2;

    while (
      (leftIdx < this.size() && this.compareFn(this.arr[curIdx], this.arr[leftIdx]) > 0) ||
      (rightIdx < this.size() && this.compareFn(this.arr[curIdx], this.arr[rightIdx]) > 0)
    ) {
      let smallerIdx = leftIdx;
      if (rightIdx < this.size() && this.compareFn(this.arr[rightIdx], this.arr[leftIdx]) < 0) {
        smallerIdx = rightIdx;
      }

      this.swap(curIdx, smallerIdx);
      curIdx = smallerIdx;
      leftIdx = curIdx * 2 + 1;
      rightIdx = curIdx * 2 + 2;
    }
  }

  empty() {
    return this.arr.length === 0;
  }

  peek(): FindStatusCode<T> {
    if (this.empty()) return STATUS_CODE.NOT_FOUND;
    return this.arr[0];
  }

  size() {
    return this.arr.length;
  }

  insert(value: T): ActionStatusCode {
    if (value === undefined) {
      throw new TypeError('Unexpected Value Inserted: undefined');
    }
    if (value === null) {
      throw new TypeError('Unexpected Value Inserted: null');
    }
    if (typeof value === 'number' && Number.isNaN(value)) {
      throw new TypeError('Unexpected Value Inserted: NaN');
    }

    this.arr.push(value);
    this.bubbleUp();
    return STATUS_CODE.SUCCESS;
  }

  remove(): ActionHasResultStatusCode<T> {
    if (this.empty()) return STATUS_CODE.FAIL;
    if (this.size() === 1) return this.arr.pop()!;

    const toRemove = this.arr[0];
    this.arr[0] = this.arr.pop()!;
    this.bubbleDown();
    return toRemove;
  }
}
