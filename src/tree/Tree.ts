import { STATUS_CODE } from "../constants/statusCode";

type TreeConstructorArgs<T> = {
  id: string;
  node: T;
};

type RemoveChildSuccess = "REMOVED" | "ROOT_SUBTREES_REMOVED";
type RemoveChildFail = "ROOT_DISALLOWED";
type RemoveChildNotFound = "NOT_FOUND";

type RemoveChildActionResult =
  | { code: typeof STATUS_CODE.NOT_FOUND; status: RemoveChildNotFound }
  | { code: typeof STATUS_CODE.SUCCESS; status: RemoveChildSuccess }
  | { code: typeof STATUS_CODE.FAIL; status: RemoveChildFail };

export class Tree<T> {
  id: string;
  node: T;

  private _parent: Tree<T> | null = null;
  private _children: Map<string, Tree<T>> = new Map();

  constructor({ id, node }: TreeConstructorArgs<T>) {
    this.id = id;
    this.node = node;
  }

  get parent() {
    return this._parent;
  }

  get children() {
    return Array.from(this._children.values());
  }

  isRoot(): boolean {
    return this._parent === null;
  }

  isLeaf(): boolean {
    return this._children.size === 0;
  }

  addChild(child: Tree<T>) {
    child._parent?._children.delete(child.id);
    this._children.set(child.id, child);
    child._parent = this;
  }

  findNodeById(treeId: string): Tree<T> | undefined {
    const stack: Tree<T>[] = [this];
    while (stack.length) {
      const cur = stack.pop()!;
      if (cur.id === treeId) return cur;
      for (const child of cur._children.values()) {
        stack.push(child);
      }
    }
    return undefined;
  }

  removeChild(treeId: string, options: { removeSubtrees?: boolean } = {}): RemoveChildActionResult {
    const target = this.findNodeById(treeId);
    if (!target) return { code: STATUS_CODE.NOT_FOUND, status: "NOT_FOUND" };

    // 1. 타겟이 root인 경우
    if (target.isRoot()) {
      if (target.isLeaf()) return { code: STATUS_CODE.FAIL, status: "ROOT_DISALLOWED" };
      if (options.removeSubtrees) {
        target._children.clear();
        return { code: STATUS_CODE.SUCCESS, status: "ROOT_SUBTREES_REMOVED" };
      }
      return { code: STATUS_CODE.FAIL, status: "ROOT_DISALLOWED" };
    }

    // 2. 서브트리를 삭제하지 않는다면 자식들을 할아버지에게 붙임
    if (!options.removeSubtrees) {
      for (const child of target._children.values()) {
        target._parent!.addChild(child);
      }
    }

    target._parent!._children.delete(target.id);
    target._parent = null;
    target._children.clear();
    return { code: STATUS_CODE.SUCCESS, status: "REMOVED" };
  }

  *[Symbol.iterator](): Generator<Tree<T>> {
    const stack: Tree<T>[] = [this];
    while (stack.length) {
      const cur = stack.pop()!;
      yield cur;

      const kids = Array.from(cur._children.values()).reverse();
      stack.push(...kids);
    }
  }

  *postOrder(): Generator<Tree<T>> {
    const queue: Tree<T>[] = [this];
    while (queue.length) {
      const cur = queue.shift()!;
      yield cur;
      queue.push(...cur._children.values());
    }
  }

  *values(): Generator<T> {
    for (const node of this) yield node.node;
  }

  // 트리 깊이 구하는 기능
  get depth(): number {
    if (this.isLeaf()) return 0;
    let max = 0;
    for (const child of this._children.values()) {
      const d = child.depth;
      if (d > max) max = d;
    }
    return max + 1;
  }

  // 트리의 총 노드 수 구하는 기능
  get size(): number {
    let cnt = 0;
    for (const _ of this) cnt++;
    return cnt;
  }
}
