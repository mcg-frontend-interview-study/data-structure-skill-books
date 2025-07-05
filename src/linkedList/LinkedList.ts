import {ActionStatusCode, STATUS_CODE} from '../constants/statusCode';

export class LinkedListNode<T> {
  value: T | null;
  next: LinkedListNode<T> | null;

  constructor(value: T | null = null, next: LinkedListNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

export class LinkedList<T> {
  head: LinkedListNode<T> | null;

  constructor(head: LinkedListNode<T> | null = null) {
    this.head = head;
  }

  // 맨 뒤에 노드 추가
  insert(value: T): ActionStatusCode {
    try {
      const newNode = new LinkedListNode<T>(value);

      if (this.head === null) {
        this.head = newNode;
      } else {
        let currentNode = this.head;
        while (currentNode?.next !== null) {
          currentNode = currentNode.next;
        }
        currentNode.next = newNode;
      }
      return STATUS_CODE.SUCCESS;
    } catch (error) {
      return STATUS_CODE.FAIL;
    }
  }

  // 특정 위치에 노드 추가
  insertAt(value: T, index: number): ActionStatusCode {
    try {
      const newNode = new LinkedListNode<T>(value);

      if (index === 0) {
        this.head = newNode;
        return STATUS_CODE.SUCCESS;
      }

      let currentIndex = 0;
      let currentNode = this.head;

      if (currentNode === null) {
        return STATUS_CODE.FAIL;
      }

      while (index - 1 !== currentIndex) {
        if (currentNode.next === null) {
          return STATUS_CODE.FAIL;
        }
        currentNode = currentNode.next;
        currentIndex++;
      }

      const tempNextNode = currentNode.next;
      currentNode.next = newNode;
      newNode.next = tempNextNode;
      return STATUS_CODE.SUCCESS;
    } catch (error) {
      return STATUS_CODE.FAIL;
    }
  }
  // 맨 뒤에 있는 노드 삭제
  delete(): ActionStatusCode {
    try {
      if (this.head === null) {
        return STATUS_CODE.FAIL;
      }

      if (this.head.next === null) {
        this.head = null;
        return STATUS_CODE.SUCCESS;
      }

      let currentNode = this.head;
      while (currentNode.next !== null && currentNode.next.next !== null) {
        currentNode = currentNode.next;
      }
      currentNode.next = null;

      return STATUS_CODE.SUCCESS;
    } catch (error) {
      return STATUS_CODE.FAIL;
    }
  }
  // 연결리스트 모든 요소 출력
  printAll() {
    let currentNode = this.head;
    const result: T[] = [];
    while (currentNode !== null) {
      result.push(currentNode.value as T);
      currentNode = currentNode.next;
    }
    return result;
  }
  // 특정 위치의 데이터 출력
  // 특정 위치에 있는 노드 삭제
  // 특정 값을 갖는 노드 삭제
  // 연결리스트 길이
}

// const linkedList = new LinkedList<string>(new LinkedListNode<string>('1'));
// console.log(linkedList.printAll());
// console.log(linkedList.head?.next?.next?.value);
// console.log(linkedList.head?.next?.next?.next?.value);
