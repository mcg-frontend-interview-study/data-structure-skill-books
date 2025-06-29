/**
 * Red-Black Tree 구현
 * 자동 균형 유지를 위해 5가지 속성을 만족해야 함
 * TNULL 센티넬 노드로 null 처리를 단순화
 */

import {Comparator, COMPARISON_RESULT, defaultNumberComparator} from '../comparator/comparator';
import {NilNode, RedBlackTreeNode, TreeNodeInterface} from './RedBlackTreeNode';

export class RedBlackTree<T> {
  private readonly TNULL: NilNode;
  private _root: TreeNodeInterface<T>;
  private _comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.TNULL = new NilNode();
    this._root = this.TNULL;
    this._comparator = comparator;
  }

  getRoot(): TreeNodeInterface<T> {
    return this._root;
  }

  insert(value: T) {
    const newNode = new RedBlackTreeNode<T>(value, this.TNULL);

    let parentNode: RedBlackTreeNode<T> | null = null;
    let currentNode: TreeNodeInterface<T> = this._root;

    while (currentNode instanceof RedBlackTreeNode) {
      parentNode = currentNode;
      const comparisonResult = this._comparator(newNode.value, parentNode.value);
      if (comparisonResult === COMPARISON_RESULT.LESS_THAN) {
        currentNode = parentNode.left || this.TNULL;
      } else if (comparisonResult === COMPARISON_RESULT.GREATER_THAN) {
        currentNode = parentNode.right || this.TNULL;
      } else {
        return; // 중복 값 허용 안함
      }
    }

    newNode.parent = parentNode;
    if (parentNode === null) {
      this._root = newNode;
    } else if (this._comparator(newNode.value, parentNode.value) === COMPARISON_RESULT.LESS_THAN) {
      parentNode.left = newNode;
    } else {
      parentNode.right = newNode;
    }

    if (newNode.parent === null) {
      newNode.color = '#000';
      return;
    }

    if (newNode.parent.parent === null) {
      return;
    }

    this._fixWhenInsert(newNode);
  }

  private _fixWhenInsert(insertedNode: RedBlackTreeNode<T>) {
    let currentNode = insertedNode;
    while (currentNode.parent && currentNode.parent.color === '#f00') {
      const parentNode = currentNode.parent as RedBlackTreeNode<T>;
      const grandParentNode = parentNode.parent as RedBlackTreeNode<T>;

      if (!grandParentNode) break;

      if (parentNode === grandParentNode.right) {
        const uncleNode = grandParentNode.left;
        if (uncleNode instanceof RedBlackTreeNode && uncleNode.color === '#f00') {
          uncleNode.color = '#000';
          parentNode.color = '#000';
          grandParentNode.color = '#f00';
          currentNode = grandParentNode;
        } else {
          if (currentNode === parentNode.left) {
            currentNode = parentNode;
            this._rotateRight(currentNode);
          }
          const newParent = currentNode.parent as RedBlackTreeNode<T>;
          const newGrandParent = newParent?.parent as RedBlackTreeNode<T>;
          if (newParent && newGrandParent) {
            newParent.color = '#000';
            newGrandParent.color = '#f00';
            this._rotateLeft(newGrandParent);
          }
        }
      } else {
        const uncleNode = grandParentNode.right;
        if (uncleNode instanceof RedBlackTreeNode && uncleNode.color === '#f00') {
          uncleNode.color = '#000';
          parentNode.color = '#000';
          grandParentNode.color = '#f00';
          currentNode = grandParentNode;
        } else {
          if (currentNode === parentNode.right) {
            currentNode = parentNode;
            this._rotateLeft(currentNode);
          }
          const newParent = currentNode.parent as RedBlackTreeNode<T>;
          const newGrandParent = newParent?.parent as RedBlackTreeNode<T>;
          if (newParent && newGrandParent) {
            newParent.color = '#000';
            newGrandParent.color = '#f00';
            this._rotateRight(newGrandParent);
          }
        }
      }
      if (currentNode === this._root) break;
    }
    if (this._root instanceof RedBlackTreeNode) {
      this._root.color = '#000';
    }
  }

  delete(value: T) {
    const targetNode = this.find(value);
    if (targetNode === this.TNULL) return;

    const nodeToDelete = targetNode as RedBlackTreeNode<T>;
    let actuallyDeletedNode: TreeNodeInterface<T> = nodeToDelete;
    let originalColor = actuallyDeletedNode.color;
    let replacementNode: TreeNodeInterface<T>;

    if (nodeToDelete.left === this.TNULL) {
      replacementNode = nodeToDelete.right || this.TNULL;
      this._transplant(nodeToDelete, replacementNode);
    } else if (nodeToDelete.right === this.TNULL) {
      replacementNode = nodeToDelete.left || this.TNULL;
      this._transplant(nodeToDelete, replacementNode);
    } else {
      actuallyDeletedNode = this._findSuccessor(nodeToDelete.right || this.TNULL);
      originalColor = actuallyDeletedNode.color;
      replacementNode = (actuallyDeletedNode as RedBlackTreeNode<T>).right || this.TNULL;

      if (actuallyDeletedNode.parent === nodeToDelete) {
        replacementNode.parent = actuallyDeletedNode;
      } else {
        this._transplant(actuallyDeletedNode as RedBlackTreeNode<T>, replacementNode);
        (actuallyDeletedNode as RedBlackTreeNode<T>).right = nodeToDelete.right;
        if ((actuallyDeletedNode as RedBlackTreeNode<T>).right) {
          ((actuallyDeletedNode as RedBlackTreeNode<T>).right as TreeNodeInterface<T>).parent = actuallyDeletedNode;
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

  private _transplant(oldNode: TreeNodeInterface<T>, newNode: TreeNodeInterface<T>) {
    if (oldNode.parent === null) {
      this._root = newNode;
    } else if (oldNode === oldNode.parent.left) {
      oldNode.parent.left = newNode;
    } else {
      oldNode.parent.right = newNode;
    }
    newNode.parent = oldNode.parent;
  }

  private _findSuccessor(startNode: TreeNodeInterface<T>): RedBlackTreeNode<T> {
    let currentNode = startNode as RedBlackTreeNode<T>;
    while (currentNode.left !== this.TNULL && currentNode.left instanceof RedBlackTreeNode) {
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

  find(value: T): TreeNodeInterface<T> {
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
    return this.TNULL;
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
