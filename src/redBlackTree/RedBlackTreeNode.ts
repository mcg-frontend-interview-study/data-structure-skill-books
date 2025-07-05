export type NodeColor = '#f00' | '#000';

export class NilNode {
  public left: null = null;
  public right: null = null;
  public color: Extract<NodeColor, '#000'> = '#000';
  public parent: RedBlackTreeNode<any> | null = null;
  public blackChip: boolean = false;
}

export class RedBlackTreeNode<T> {
  public color: NodeColor = '#f00';
  public parent: RedBlackTreeNode<T> | null = null;
  public blackChip: boolean = false;

  public value: T;
  public left: RedBlackTreeNode<T> | NilNode;
  public right: RedBlackTreeNode<T> | NilNode;

  constructor(value: T, nilNode: NilNode) {
    this.value = value;
    this.left = nilNode;
    this.right = nilNode;
  }

  getParent;
}
