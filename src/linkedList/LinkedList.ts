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
  insert(value: T) {
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
  }

  // 특정 위치에 노드 추가
  // 맨 뒤에 있는 노드 삭제
  // 특정 위치에 있는 노드 삭제
  // 특정 값을 갖는 노드 삭제
  // 연결리스트 길이
  // 연결리스트 모든 요소 출력
  // 특정 위치의 데이터 출력
}

// const linkedList = new LinkedList<string>(new LinkedListNode<string>('1'));
// console.log(linkedList.head?.value);
// console.log(linkedList.head?.next?.value);
