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

  constructor() {
    // TNULL 센티넬 노드
  }
}

export class RedBlackTreeNode<T> implements TreeNodeInterface<T> {
  public value: T;
  public color: NodeColor;
  public left: TreeNodeInterface<T> | null;
  public right: TreeNodeInterface<T> | null;
  public parent: TreeNodeInterface<T> | null;
  public blackChip: boolean;

  constructor(value: T, nilNode: NilNode) {
    this.value = value;
    this.color = '#f00';
    this.left = nilNode;
    this.right = nilNode;
    this.parent = null;
    this.blackChip = false;
  }
}
