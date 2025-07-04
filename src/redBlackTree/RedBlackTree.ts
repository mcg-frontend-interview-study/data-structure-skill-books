import {FindStatusCode} from './../constants/statusCode';
import {Comparator, COMPARISON_RESULT, defaultNumberComparator} from '../comparator/comparator';
import {ActionHasResultStatusCode, ActionStatusCode, STATUS_CODE} from '../constants/statusCode';
import {NilNode, RedBlackTreeNode, TreeNodeInterface} from './RedBlackTreeNode';

export class RedBlackTree<T> {
  private readonly TNULL: NilNode = new NilNode();
  private _root: TreeNodeInterface<T> = this.TNULL;
  private _comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this._comparator = comparator;
  }

  getRoot(): TreeNodeInterface<T> {
    return this._root;
  }

  insert(value: T) {
    const newNode = new RedBlackTreeNode<T>(value, this.TNULL);

    let parentNode: RedBlackTreeNode<T> | null = null;
    let comparisonTargetNode: TreeNodeInterface<T> = this._root;

    // parentNode 찾기. 실핼 결과는 null 또는 RedBlackTreeNode
    // 비교 대상이 유의미한 노드일때
    while (comparisonTargetNode instanceof RedBlackTreeNode) {
      parentNode = comparisonTargetNode;
      const comparisonResult = this._comparator(newNode.value, parentNode.value);

      if (comparisonResult === COMPARISON_RESULT.LESS_THAN) {
        comparisonTargetNode = parentNode.left;
      } else if (comparisonResult === COMPARISON_RESULT.GREATER_THAN) {
        comparisonTargetNode = parentNode.right;
      } else {
        return; // 중복 값 허용 안함
      }
    }
    // parentNode는 유의미 노드

    newNode.parent = parentNode;
    // 루트인 경우 (while문 진행이 안되기 때문에 parentNode = null)
    if (parentNode === null) {
      this._root = newNode;

      // parentNode가 RedBlackTreeNode로 validNode일 때 = 비교 후 left, right 넣기
    } else if (this._comparator(newNode.value, parentNode.value) === COMPARISON_RESULT.LESS_THAN) {
      parentNode.left = newNode;
    } else {
      parentNode.right = newNode;
    }

    // 새로 추가된 노드가 root인 경우
    if (newNode.parent === null) {
      newNode.color = '#000';
      return;
    }

    // 새로 추가되는 노드의 부모가 root인 경우, 어차피 black이고 자녀는 red이기 때문에 룰 위반 없음. fix 로직 실행을 막기 위한 얼리 리턴
    if (newNode.parent.parent === null) {
      return;
    }

    this._fixWhenInsert(newNode);
  }

  // 여기는 parentNode가 있으며 그게 RedBlackTreeNode인 경우 진입.
  private _fixWhenInsert(insertedNode: RedBlackTreeNode<T>) {
    let childNode = insertedNode;

    // 부모가 있고, 부모가 red 라면 실행
    while (childNode.parent && childNode.parent.color === '#f00') {
      let parentNode = childNode.parent;
      const grandParentNode = parentNode.parent;

      // 조부가 없다면 부모 자식만 있는 상황(높이 2)이고 이때는 부모를 black으로 바꾸기만 하면 됨.
      if (!grandParentNode) break;

      // 부모가 조부의 오른쪽이라면
      if (parentNode === grandParentNode.right) {
        // 부모의 형제는 왼쪽
        const uncleNode = grandParentNode.left;

        // case 1. 부모 형제가 red
        if (uncleNode instanceof RedBlackTreeNode && uncleNode.color === '#f00') {
          // [1] switch
          uncleNode.color = '#000';
          parentNode.color = '#000';
          grandParentNode.color = '#f00';

          // [2] bubbling
          childNode = grandParentNode;
        } else {
          // case 2. 형제가 없거나 black인 경우
          // case 2.1. 꺾임
          if (childNode === parentNode.left) {
            // [1] 꺾임 풀기
            this._rotateRight(parentNode);
            [childNode, parentNode] = [parentNode, childNode]; // 참조 정리
          }

          // case 2.2. 직선
          // [2] 싱글 교환
          parentNode.color = '#000';
          grandParentNode.color = '#f00';

          // [3] 싱글 회전
          this._rotateLeft(grandParentNode);
        }
      } else {
        // 부모 - 조상 - 부모 형제
        const uncleNode = grandParentNode.right;

        // case 1. 부모 형제가 red
        if (uncleNode instanceof RedBlackTreeNode && uncleNode.color === '#f00') {
          // [1] switch
          uncleNode.color = '#000';
          parentNode.color = '#000';
          grandParentNode.color = '#f00';

          // [2] bubbling
          childNode = grandParentNode;
        } else {
          // case 2.1. 꺾임
          if (childNode === parentNode.right) {
            // [1] 꺾임 풀기
            this._rotateLeft(parentNode);
            [childNode, parentNode] = [parentNode, childNode]; // 참조 정리
          }

          // case 2.2 직선
          // [2] 싱글 교환
          parentNode.color = '#000';
          grandParentNode.color = '#f00';

          // [3] 싱글 회전
          this._rotateRight(grandParentNode);
        }
      }

      if (childNode === this._root) break;
    }

    if (this._root instanceof RedBlackTreeNode) {
      this._root.color = '#000';
    }
  }

  delete(value: T): ActionHasResultStatusCode<RedBlackTreeNode<T>> {
    const targetNode = this.find(value);

    if (targetNode === STATUS_CODE.NOT_FOUND) return STATUS_CODE.FAIL;

    const nodeToDelete = targetNode;

    let actuallyDeletedNode: RedBlackTreeNode<T> = nodeToDelete; // 계승자.
    let originalColor = actuallyDeletedNode.color;
    let replacementNode: RedBlackTreeNode<T> | NilNode;

    const rightNodeToDelete = nodeToDelete.right;
    const leftNodeToDelete = nodeToDelete.left;
    if (leftNodeToDelete instanceof NilNode && rightNodeToDelete instanceof NilNode) {
      // 1. 리프 노드
      replacementNode = this.TNULL;
      this._transplant(nodeToDelete, replacementNode);
    } else if (leftNodeToDelete instanceof NilNode) {
      // 2. 오른쪽 자식만 있음
      replacementNode = nodeToDelete.right;
      this._transplant(nodeToDelete, replacementNode);
    } else if (rightNodeToDelete instanceof NilNode) {
      // 3. 왼쪽 자식만 있음.
      replacementNode = nodeToDelete.left;
      this._transplant(nodeToDelete, replacementNode);
    } else {
      // 4. 두 자식 다 있음.
      actuallyDeletedNode = this._findSuccessor(rightNodeToDelete);

      originalColor = actuallyDeletedNode.color;
      replacementNode = actuallyDeletedNode.right || this.TNULL; // 계승자는 왼쪽 자식이 없다. 오른쪽 자식은 있거나 없다.

      if (actuallyDeletedNode.parent === nodeToDelete) {
        // 계승자가 직계 자식
        replacementNode.parent = actuallyDeletedNode;
      } else {
        // 계승자가 직계 자식이 아님
        this._transplant(actuallyDeletedNode, replacementNode);
        // actuallyDeletedNode.right = nodeToDelete.right;

        if (actuallyDeletedNode.right) {
          actuallyDeletedNode.right.parent = actuallyDeletedNode;
        }
      }
      this._transplant(nodeToDelete, actuallyDeletedNode as RedBlackTreeNode<T>);
      (actuallyDeletedNode as RedBlackTreeNode<T>).left = nodeToDelete.left;
      if ((actuallyDeletedNode as RedBlackTreeNode<T>).left) {
        ((actuallyDeletedNode as RedBlackTreeNode<T>).left as TreeNodeInterface<T>).parent = actuallyDeletedNode;
      }
      actuallyDeletedNode.color = nodeToDelete.color;
    }

    if (originalColor === '#000') {
      replacementNode.blackChip = true;
      this._fixWhenDelete(replacementNode);
    }
  }

  private _fixWhenDelete(doubleBlackNode: TreeNodeInterface<T>) {
    let currentDoubleBlackNode = doubleBlackNode;

    while (currentDoubleBlackNode !== this._root && currentDoubleBlackNode.blackChip) {
      const parentNode = currentDoubleBlackNode.parent as RedBlackTreeNode<T>;

      if (currentDoubleBlackNode === parentNode.left) {
        let siblingNode = parentNode.right as RedBlackTreeNode<T> | null;

        if (siblingNode instanceof RedBlackTreeNode && siblingNode.color === '#f00') {
          siblingNode.color = '#000';
          parentNode.color = '#f00';
          this._rotateLeft(parentNode);
          siblingNode = parentNode.right as RedBlackTreeNode<T>;
        }

        if (siblingNode) {
          const leftChildColor = siblingNode.left instanceof RedBlackTreeNode ? siblingNode.left.color : '#000';
          const rightChildColor = siblingNode.right instanceof RedBlackTreeNode ? siblingNode.right.color : '#000';

          if (leftChildColor === '#000' && rightChildColor === '#000') {
            siblingNode.color = '#f00';
            currentDoubleBlackNode.blackChip = false;

            if (parentNode.color === '#f00') {
              parentNode.color = '#000';
              break;
            } else {
              currentDoubleBlackNode = parentNode;
              currentDoubleBlackNode.blackChip = true;
            }
          } else {
            if (rightChildColor === '#000') {
              if (siblingNode.left instanceof RedBlackTreeNode) {
                siblingNode.left.color = '#000';
              }
              siblingNode.color = '#f00';
              this._rotateRight(siblingNode);
              siblingNode = parentNode.right as RedBlackTreeNode<T>;
            }

            if (siblingNode instanceof RedBlackTreeNode) {
              siblingNode.color = parentNode.color;
              if (siblingNode.right instanceof RedBlackTreeNode) {
                siblingNode.right.color = '#000';
              }
            }
            parentNode.color = '#000';
            this._rotateLeft(parentNode);
            currentDoubleBlackNode = this._root;
          }
        }
      } else {
        let siblingNode = parentNode.left as RedBlackTreeNode<T> | null;

        if (siblingNode instanceof RedBlackTreeNode && siblingNode.color === '#f00') {
          siblingNode.color = '#000';
          parentNode.color = '#f00';
          this._rotateRight(parentNode);
          siblingNode = parentNode.left as RedBlackTreeNode<T>;
        }

        if (siblingNode instanceof NilNode) break;

        if (siblingNode) {
          const leftChildColor = siblingNode.left instanceof RedBlackTreeNode ? siblingNode.left.color : '#000';
          const rightChildColor = siblingNode.right instanceof RedBlackTreeNode ? siblingNode.right.color : '#000';

          if (leftChildColor === '#000' && rightChildColor === '#000') {
            siblingNode.color = '#f00';
            currentDoubleBlackNode.blackChip = false;

            if (parentNode.color === '#f00') {
              parentNode.color = '#000';
              break;
            } else {
              currentDoubleBlackNode = parentNode;
              currentDoubleBlackNode.blackChip = true;
            }
          } else {
            if (leftChildColor === '#000') {
              if (siblingNode.right instanceof RedBlackTreeNode) {
                siblingNode.right.color = '#000';
              }
              siblingNode.color = '#f00';
              this._rotateLeft(siblingNode);
              siblingNode = parentNode.left as RedBlackTreeNode<T>;
            }

            if (siblingNode instanceof RedBlackTreeNode) {
              siblingNode.color = parentNode.color;
              if (siblingNode.left instanceof RedBlackTreeNode) {
                siblingNode.left.color = '#000';
              }
            }
            parentNode.color = '#000';
            this._rotateRight(parentNode);
            currentDoubleBlackNode = this._root;
          }
        }
      }
    }
    currentDoubleBlackNode.blackChip = false;
  }

  private _transplant(oldNode: RedBlackTreeNode<T>, newNode: RedBlackTreeNode<T> | NilNode) {
    if (oldNode.parent === null) {
      // 1. 지우려는 노드가 루트
      this._root = newNode;
    } else if (oldNode === oldNode.parent.left) {
      // 2. 지우려는 노드가 부모의 왼쪽
      oldNode.parent.left = newNode;
    } else {
      // 3. 지우려는 노드가 부모의 오른쪽
      oldNode.parent.right = newNode;
    }

    // 부모 정리
    newNode.parent = oldNode.parent;
  }

  private _findSuccessor(startNode: RedBlackTreeNode<T>): RedBlackTreeNode<T> {
    let currentNode: RedBlackTreeNode<T> = startNode;

    while (currentNode.left instanceof RedBlackTreeNode) {
      currentNode = currentNode.left;
    }

    return currentNode;
  }

  private _rotateLeft(pivotNode: RedBlackTreeNode<T>) {
    const rightChild = pivotNode.right as RedBlackTreeNode<T>;
    if (!rightChild || rightChild === this.TNULL) return;

    pivotNode.right = rightChild.left;
    if (rightChild.left !== this.TNULL && rightChild.left) {
      rightChild.left.parent = pivotNode;
    }
    rightChild.parent = pivotNode.parent;
    if (pivotNode.parent === null) {
      this._root = rightChild;
    } else if (pivotNode === pivotNode.parent.left) {
      pivotNode.parent.left = rightChild;
    } else {
      pivotNode.parent.right = rightChild;
    }
    rightChild.left = pivotNode;
    pivotNode.parent = rightChild;
  }

  private _rotateRight(pivotNode: RedBlackTreeNode<T>) {
    const leftChild = pivotNode.left as RedBlackTreeNode<T>;
    if (!leftChild || leftChild === this.TNULL) return;

    pivotNode.left = leftChild.right;
    if (leftChild.right !== this.TNULL && leftChild.right) {
      leftChild.right.parent = pivotNode;
    }
    leftChild.parent = pivotNode.parent;
    if (pivotNode.parent === null) {
      this._root = leftChild;
    } else if (pivotNode === pivotNode.parent.right) {
      pivotNode.parent.right = leftChild;
    } else {
      pivotNode.parent.left = leftChild;
    }
    leftChild.right = pivotNode;
    pivotNode.parent = leftChild;
  }

  find(value: T): FindStatusCode<RedBlackTreeNode<T>> {
    let currentNode: TreeNodeInterface<T> = this._root;

    while (currentNode instanceof RedBlackTreeNode) {
      const comparisonResult = this._comparator(value, currentNode.value);
      if (comparisonResult === COMPARISON_RESULT.EQUAL) {
        return currentNode;
      } else if (comparisonResult === COMPARISON_RESULT.LESS_THAN) {
        currentNode = currentNode.left || this.TNULL;
      } else {
        currentNode = currentNode.right || this.TNULL;
      }
    }

    return STATUS_CODE.NOT_FOUND;
  }

  print() {
    if (this._root !== this.TNULL) {
      this._printNode(this._root, '', true);
    }
  }

  private _printNode(node: TreeNodeInterface<T>, prefix: string, isTail: boolean) {
    if (node instanceof RedBlackTreeNode) {
      const color = node.color === '#f00' ? '🟥' : '⬛️';
      console.log(`${prefix}${isTail ? '└── ' : '├── '}${node.value} (${color})`);

      const children: Array<{node: TreeNodeInterface<T>; isLeft: boolean}> = [];
      if (node.left !== this.TNULL && node.left) children.push({node: node.left, isLeft: true});
      if (node.right !== this.TNULL && node.right) children.push({node: node.right, isLeft: false});

      children.forEach((child, index) => {
        const isLast = index === children.length - 1;
        const newPrefix = prefix + (isTail ? '    ' : '│   ');
        this._printNode(child.node, newPrefix, isLast);
      });
    }
  }
}

const redBlackTree = new RedBlackTree<number>(defaultNumberComparator);

redBlackTree.insert(14);
redBlackTree.insert(7);
redBlackTree.insert(17);
redBlackTree.insert(12);
redBlackTree.insert(4);
redBlackTree.insert(3);
redBlackTree.insert(5);

redBlackTree.insert(15);
redBlackTree.insert(22);
redBlackTree.insert(19);
redBlackTree.insert(24);

redBlackTree.insert(2);
redBlackTree.insert(21);
redBlackTree.insert(20);
redBlackTree.delete(20);
redBlackTree.delete(17);
redBlackTree.delete(19);
redBlackTree.delete(7);
redBlackTree.delete(14);

redBlackTree.print();
