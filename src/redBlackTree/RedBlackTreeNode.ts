export type NodeColor = '#f00' | '#000';

export class NilNode {
  public parent: RedBlackTreeNode<any> | NilNode | null = null;
  public left: NilNode | null = null;
  public right: NilNode | null = null;
  public color: Extract<NodeColor, '#000'> = '#000';
  public value: null = null;
  public blackChip: boolean = false;

  constructor() {}
}

export class RedBlackTreeNode<T> {
  public value: T;
  public color: '#f00' | '#000';
  public parent: RedBlackTreeNode<T> | null = null;
  public left: RedBlackTreeNode<T> | NilNode;
  public right: RedBlackTreeNode<T> | NilNode;
  public blackChip: boolean = false;

  constructor(value: T, TNULL: NilNode) {
    this.value = value;
    this.left = TNULL;
    this.right = TNULL;
    this.color = '#f00'; // 새 노드는 항상 RED
  }
}
