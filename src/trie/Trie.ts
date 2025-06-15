import {
  STATUS_CODE,
  ActionStatusCode,
  FindStatusCode,
} from '../constants/statusCode';

class Node<T> {
  key: string;
  value: T | null;
  child: Map<string, Node<T>>;

  constructor(key = '', value = null) {
    this.key = key;
    this.value = value;
    this.child = new Map();
  }
}

export class Trie<T> {
  private root: Node<T>;

  constructor() {
    this.root = new Node<T>();
  }

  insert(key: string, value: T): ActionStatusCode {
    let currentNode = this.root;

    try {
      for (let i = 0; i < key.length; i++) {
        const word = key[i];
        // child가 없으면 새로운 노드 생성
        if (!currentNode.child.has(word)) {
          currentNode.child.set(word, new Node(word));
        }
        currentNode = currentNode.child.get(word)!;
      }
      currentNode.value = value;
      return STATUS_CODE.SUCCESS;
    } catch (error) {
      return STATUS_CODE.FAIL;
    }
  }

  search(key: string): FindStatusCode<T> {
    let currentNode = this.root;

    for (let i = 0; i < key.length; i++) {
      const word = key[i];
      // 자식 노드가 있을 때
      if (currentNode.child.has(word)) {
        currentNode = currentNode.child.get(word)!;
      } else {
        return STATUS_CODE.NOT_FOUND;
      }
    }
    return currentNode.value ?? STATUS_CODE.NOT_FOUND;
  }

  delete(key: string): ActionStatusCode {
    try {
      this.deleteFunc(this.root, key, 0);
      return STATUS_CODE.SUCCESS;
    } catch (error) {
      return STATUS_CODE.FAIL;
    }
  }

  private deleteFunc(node: Node<T>, key: string, index: number): boolean {
    // 마지막 노드로 이동하여 재귀적으로 자식 탐색
    if (index === key.length) {
      if (node.value === null) {
        return false;
      }
      node.value = null;
      return node.child.size === 0;
    }

    const char = key[index];
    const childNode = node.child.get(char);

    if (!childNode || !this.deleteFunc(childNode, key, index + 1)) {
      return false;
    }
    node.child.delete(key);
    return node.value === null && node.child.size === 0;
  }
}
