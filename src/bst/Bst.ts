/**
 * 실패하는 경우가 있는 메서드의 경우 실패: -1, 성공: 0
 * 에러를 던지지 않는 이유는 자료구조로 인해 프로그램이 중단되지 않도록 하기 위해
 *
 * "없다", "찾을 수 없다" 는 엄격히 다르다. 전자는 null, 후자는 -1
 */

import {ActionStatusCode, FindStatusCode, STATUS_CODE} from '../constants/statusCode';
import {BSTNode} from './BstNode';
import {Comparator, COMPARISON_RESULT} from '../comparator/comparator';

// TODO: 생성자에 타입을 넣지 않으면 올바르게 사용하기 어려움
export class BST<T extends any> {
  private _root: BSTNode<T> | null;
  private _size: number;
  private _comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this._root = null;
    this._size = 0;

    this._comparator = comparator;
  }

  private _getComparator() {
    return this._comparator;
  }

  insert(value: T) {
    this.insertByIteration(value);
  }

  insertByRecursion(value: T) {
    const parentNode = this.getRoot();

    if (parentNode === null) {
      this._insertFirst(value);
      return;
    } else {
      const newNode = new BSTNode(value);

      this._insertByRecursion(parentNode, newNode);
      this._addSize();
    }
  }

  private _insertByRecursion(parentNode: BSTNode<T>, newNode: BSTNode<T>) {
    const comparator = this._getComparator();
    const comparisionResult = comparator(newNode.getValue(), parentNode.getValue());

    switch (comparisionResult) {
      case COMPARISON_RESULT.EQUAL:
        parentNode.addExistCount();
        break;

      case COMPARISON_RESULT.GREATER_THAN:
        const rightNode = parentNode.getRight();

        if (rightNode === null) {
          parentNode.setRight(newNode);
          newNode.setParent(parentNode);
        } else {
          this._insertByRecursion(rightNode, newNode);
        }
        break;

      case COMPARISON_RESULT.LESS_THAN:
        const leftNode = parentNode.getLeft();

        if (leftNode === null) {
          parentNode.setLeft(newNode);
          newNode.setParent(parentNode);
        } else {
          this._insertByRecursion(leftNode, newNode);
        }
        break;
    }
  }

  insertByIteration(value: T) {
    let rootNode = this.getRoot();

    if (rootNode === null) {
      this._insertFirst(value);
      return;
    } else {
      let parentNode: BSTNode<T> = rootNode;

      const newNode = new BSTNode(value);

      let stopFlag: boolean = false;

      while (!stopFlag) {
        const comparator = this._getComparator();
        const comparisionResult = comparator(value, parentNode.getValue());

        switch (comparisionResult) {
          case COMPARISON_RESULT.EQUAL:
            parentNode.addExistCount();
            stopFlag = true;
            break;

          case COMPARISON_RESULT.GREATER_THAN:
            const rightNode = parentNode.getRight();

            // 새 값이 더 큰 경우
            if (rightNode === null) {
              // 자식이 없는 경우
              parentNode.setRight(newNode);
              newNode.setParent(parentNode);
              stopFlag = true;

              break;
            } else {
              // 자식이 있는 경우
              parentNode = rightNode;
              break;
            }

          case COMPARISON_RESULT.LESS_THAN:
            const leftNode = parentNode.getLeft();

            // 새 값이 더 작은 경우
            if (leftNode === null) {
              parentNode.setLeft(newNode);
              newNode.setParent(parentNode);

              stopFlag = true;

              break;
            } else {
              parentNode = leftNode;
              break;
            }
        }
      }
      this._addSize();
    }
  }

  private _insertFirst(value: T) {
    const node = new BSTNode<T>(value);

    this._setRoot(node);
    this._addSize();
  }

  find(value: T): FindStatusCode<BSTNode<T>> {
    return this.findNodeByIteration(value);
  }

  findNodeByIteration(value: T): FindStatusCode<BSTNode<T>> {
    let rootNode = this.getRoot();

    if (rootNode === null) {
      return STATUS_CODE.NOT_FOUND;
    } else {
      const comparator = this._getComparator();
      let parentNode = rootNode;

      while (true) {
        const comparisionResult = comparator(value, parentNode.getValue());

        switch (comparisionResult) {
          case COMPARISON_RESULT.EQUAL:
            return parentNode;

          case COMPARISON_RESULT.GREATER_THAN:
            const rightNode = parentNode.getRight();

            if (rightNode === null) {
              return STATUS_CODE.NOT_FOUND;
            } else {
              parentNode = rightNode;
              continue;
            }

          case COMPARISON_RESULT.LESS_THAN:
            const leftNode = parentNode.getLeft();

            if (leftNode === null) {
              return STATUS_CODE.NOT_FOUND;
            } else {
              parentNode = leftNode;
              continue;
            }
        }
      }
    }
  }

  findNodeByRecursion(value: T): FindStatusCode<BSTNode<T>> {
    const rootNode = this.getRoot();

    if (rootNode === null) {
      return STATUS_CODE.NOT_FOUND;
    }

    return this._findNodeByRecursion(rootNode, value);
  }

  private _findNodeByRecursion(parentNode: BSTNode<T>, value: T): FindStatusCode<BSTNode<T>> {
    const comparetor = this._getComparator();

    const comparisonResult = comparetor(value, parentNode.getValue());

    switch (comparisonResult) {
      case COMPARISON_RESULT.EQUAL:
        return parentNode;

      case COMPARISON_RESULT.GREATER_THAN:
        const rightNode = parentNode.getRight();
        if (rightNode === null) {
          return STATUS_CODE.NOT_FOUND;
        } else {
          return this._findNodeByRecursion(rightNode, value);
        }

      case COMPARISON_RESULT.LESS_THAN:
        const leftNode = parentNode.getLeft();
        if (leftNode === null) {
          return STATUS_CODE.NOT_FOUND;
        } else {
          return this._findNodeByRecursion(leftNode, value);
        }
    }
  }

  private _clearRoot() {
    this._root = null;
  }

  delete(value: T): ActionStatusCode {
    return this.deleteByIteration(value);
  }

  deleteByIteration(value: T): ActionStatusCode {
    const statusCode = this._deleteByIteration(value);

    if (statusCode === 0) {
      this._subtractSize();
    }

    return statusCode;
  }

  private _deleteByIteration(value: T): ActionStatusCode {
    const targetNode = this.findNodeByIteration(value);

    if (targetNode === -1) {
      // 해당하는 노드가 트리에 없는 경우
      return STATUS_CODE.FAIL;
    }

    if (targetNode.getExistCount() >= 2) {
      targetNode.subtractExistCount();

      return STATUS_CODE.SUCCESS;
    }

    const leftChild = targetNode.getLeft();
    const rightChild = targetNode.getRight();

    const parentNode = targetNode.getParent();

    if (leftChild === null && rightChild === null) {
      // 제거 노드가 리프 노드인 경우
      if (parentNode === null) {
        // 제거 노드가 루트 노드인 경우
        this._clearRoot();
      } else {
        if (parentNode.getLeft() === targetNode) {
          parentNode.clearLeft();
        } else {
          parentNode.clearRight();
        }
      }
    } else if (leftChild !== null && rightChild !== null) {
      const LN = this.findLargestNodeByIteration(leftChild);

      const child = LN.getLeft();

      if (child) {
        const parent = LN.getParent();

        if (parent) {
          if (parent.getLeft() === LN) {
            parent.setLeft(child);
            child.setParent(parent);
          } else if (parent.getRight() === LN) {
            parent.setRight(child);
            child.setParent(parent);
          }

          LN.clearLeft();
          LN.clearParent();
        }
      }

      const parent = LN.getParent();

      if (parent) {
        parent.clearRight();
        LN.clearParent();
      }

      const parentNode = targetNode.getParent();

      if (parentNode === null) {
        this._setRoot(LN);
        LN.clearParent();

        const l = targetNode.getLeft();
        if (l && l !== LN) {
          LN.setLeft(l);
          l.setParent(LN);
        }

        LN.setRight(rightChild);
        rightChild.setParent(LN);
      } else {
        if (parentNode.getLeft() === targetNode) {
          parentNode.setLeft(LN);
          LN.setParent(parentNode);

          LN.setRight(rightChild);
          rightChild.setParent(LN);

          const l = targetNode.getLeft();
          if (l && l !== LN) {
            LN.setLeft(l);
            l.setParent(LN);
          }
        } else if (parentNode.getRight() === targetNode) {
          parentNode.setRight(LN);
          LN.setParent(parentNode);

          const l = targetNode.getLeft();
          if (l && l !== LN) {
            LN.setLeft(l);
            l.setParent(LN);
          }
          LN.setRight(rightChild);
          rightChild.setParent(LN);
        }
      }
    } else {
      if (leftChild !== null) {
        if (parentNode === null) {
          // 제거 노드가 한쪽 자식만 있는 경우
          leftChild.clearParent();
          this._setRoot(leftChild);
        } else {
          if (parentNode.getLeft() === targetNode) {
            parentNode.setLeft(leftChild);
            leftChild.setParent(parentNode);
          } else if (parentNode.getRight() === targetNode) {
            parentNode.setRight(leftChild);
            leftChild.setParent(parentNode);
          }
        }
      } else if (rightChild !== null) {
        if (parentNode === null) {
          // 제거 노드가 한쪽 자식만 있는 경우
          rightChild.clearParent();
          this._setRoot(rightChild);
        } else {
          if (parentNode.getLeft() === targetNode) {
            parentNode.setLeft(rightChild);
            rightChild.setParent(parentNode);
          } else if (parentNode.getRight() === targetNode) {
            parentNode.setRight(rightChild);
            rightChild.setParent(parentNode);
          }
        }
      }
    }

    return STATUS_CODE.SUCCESS;
  }

  findLargestNodeByIteration(node: BSTNode<T>): BSTNode<T> {
    if (node.isLeaf()) {
      return node;
    }

    let parentNode = node;

    while (true) {
      const rightNode = parentNode.getRight();

      if (rightNode === null) {
        return parentNode;
      } else {
        parentNode = rightNode;

        continue;
      }
    }
  }

  getSize() {
    return this._size;
  }

  private _addSize() {
    this._size += 1;
  }

  private _subtractSize() {
    this._size -= 1;
  }

  getRoot() {
    return this._root;
  }

  private _setRoot(node: BSTNode<T>) {
    this._root = node;
  }

  traverseInOrderByRecursion(): T[] {
    const rootNode = this.getRoot();

    if (rootNode === null) {
      return [];
    }

    const result = [];
    this._traverseInOrderByRecursion(rootNode, result);

    return result;
  }

  private _traverseInOrderByRecursion(parentNode: BSTNode<T>, result: T[]) {
    const leftNode = parentNode.getLeft();
    if (leftNode) {
      this._traverseInOrderByRecursion(leftNode, result);
    }

    result.push(parentNode.getValue());

    const rightNode = parentNode.getRight();
    if (rightNode) {
      this._traverseInOrderByRecursion(rightNode, result);
    }
  }

  traversePreOrderByRecursion(): T[] {
    const rootNode = this.getRoot();

    if (rootNode === null) {
      return [];
    }

    const result = [];
    this._traversePreOrderByRecursion(rootNode, result);

    return result;
  }

  private _traversePreOrderByRecursion(parentNode: BSTNode<T>, result: T[]) {
    result.push(parentNode.getValue());

    const leftNode = parentNode.getLeft();
    if (leftNode) {
      this._traversePreOrderByRecursion(leftNode, result);
    }

    const rightNode = parentNode.getRight();
    if (rightNode) {
      this._traversePreOrderByRecursion(rightNode, result);
    }
  }

  traversePostOrderByRecursion(): T[] {
    const rootNode = this.getRoot();

    if (rootNode === null) {
      return [];
    }

    const result = [];
    this._traversePostOrderByRecursion(rootNode, result);

    return result;
  }

  private _traversePostOrderByRecursion(parentNode: BSTNode<T>, result: T[]) {
    const leftNode = parentNode.getLeft();
    if (leftNode) {
      this._traversePostOrderByRecursion(leftNode, result);
    }

    const rightNode = parentNode.getRight();
    if (rightNode) {
      this._traversePostOrderByRecursion(rightNode, result);
    }

    result.push(parentNode.getValue());
  }

  /* istanbul ignore next */
  printTreeByIteration(rootValue?: T, printFn?: (res: string) => void): ActionStatusCode {
    if (this.getSize() === 0) {
      console.log('empty tree');
      return STATUS_CODE.SUCCESS;
    }

    let rootNode = rootValue ? this.findNodeByIteration(rootValue) : this.getRoot();
    if (rootNode === null || rootNode === STATUS_CODE.NOT_FOUND) {
      return STATUS_CODE.FAIL;
    }

    const logs: string[] = [];

    this._traverseForPrint(rootNode, 0, 'center', logs);

    if (printFn) {
      printFn(logs.join('\n'));
    } else {
      console.log(logs.join('\n'));
    }

    return STATUS_CODE.SUCCESS;
  }

  /* istanbul ignore next */
  private _traverseForPrint(
    parentNode: BSTNode<T>,
    depth: number,
    direction: 'center' | 'left' | 'right',
    logs: string[],
  ) {
    const SPACE = '    ';

    const rightNode = parentNode.getRight();

    if (rightNode) {
      this._traverseForPrint(rightNode, depth + 1, 'right', logs);
    }

    let directionString: string = '';
    switch (direction) {
      case 'center':
        directionString = '';
        break;
      case 'left':
        directionString = '↘';
        break;
      case 'right':
        directionString = '↗';
        break;
    }

    let spaceString = SPACE.repeat(depth);

    let log = `${spaceString}${directionString} ${JSON.stringify(parentNode.getValue())}${
      parentNode.getExistCount() > 1 ? `(${parentNode.getExistCount()})` : ''
    }`;

    logs.push(log);

    const leftNode = parentNode.getLeft();
    if (leftNode) {
      this._traverseForPrint(leftNode, depth + 1, 'left', logs);
    }
  }
}
