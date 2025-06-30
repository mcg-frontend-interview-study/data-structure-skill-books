export type NodeColor = '#f00' | '#000';

export interface TreeNodeInterface<T> {
  left: TreeNodeInterface<T> | null;
  right: TreeNodeInterface<T> | null;
  parent: TreeNodeInterface<T> | null;
  color: NodeColor;
  blackChip: boolean;
}

export class NilNode implements TreeNodeInterface<any> {
  public left: null = null;
  public right: null = null;
  public color: NodeColor = '#000';
  public parent: TreeNodeInterface<any> | null = null;
  public blackChip: boolean = false;
}

export class RedBlackTreeNode<T> implements TreeNodeInterface<T> {
  public color: NodeColor = '#f00';
  public parent: TreeNodeInterface<T> | null = null;
  public blackChip: boolean = false;

  public value: T;
  public left: TreeNodeInterface<T>;
  public right: TreeNodeInterface<T>;

  constructor(value: T, nilNode: NilNode) {
    this.value = value;
    this.left = nilNode;
    this.right = nilNode;
  }
}
