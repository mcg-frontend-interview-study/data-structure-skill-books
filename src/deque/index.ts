import {LinkedList} from '../linkedList/LinkedList';

export class Deque<T> {
  private list: LinkedList<T>;

  constructor(initialValues?: T[]) {
    this.list = new LinkedList<T>();
    if (initialValues) {
      initialValues.forEach(value => this.appendRight(value));
    }
  }

  appendLeft(value: T): void {
    if (value != null) {
      this.list.insertAt(value, 0);
    }
  }

  appendRight(value: T): void {
    if (value != null) {
      this.list.insert(value);
    }
  }

  popLeft(): T | undefined {
    const head = this.list.head;
    if (!head) {
      return undefined;
    }
    this.list.deleteAt(0);
    return head.value as T; // 위에서 head가 null인 경우를 이미 검증했으므로 단언해도 된다.
  }

  popRight(): T | undefined {
    if (this.list.head === null) {
      return undefined;
    }

    let currentNode = this.list.head;
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }

    this.list.delete();
    return currentNode.value as T; // 위에서 head가 null인 경우를 이미 검증했으므로 단언해도 된다.
  }

  get size(): number {
    return this.list.length();
  }

  *[Symbol.iterator](): Iterator<T> {
    let currentNode = this.list.head;
    while (currentNode) {
      if (currentNode.value !== null) {
        yield currentNode.value;
      }
      currentNode = currentNode.next;
    }
  }
}
