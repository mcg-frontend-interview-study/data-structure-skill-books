import { Tree } from "../Tree";

/** 샘플 트리
 *      root(R)
 *      ├─ a(A)
 *      │   └─ c(C)
 *      └─ b(B)
 */
const buildSampleTree = () => {
  const root = new Tree({ id: "root", node: "R" });
  const a = new Tree({ id: "a", node: "A" });
  const b = new Tree({ id: "b", node: "B" });
  const c = new Tree({ id: "c", node: "C" });

  root.addChild(a);
  root.addChild(b);
  a.addChild(c);

  return { root, a, b, c };
};

describe("Tree ― unit tests", () => {
  describe("constructor test", () => {
    it("새 트리는 size가 1, depth가 0이다", () => {
      const d = new Tree({ id: "d", node: "D" });

      expect(d.size).toBe(1);
      expect(d.depth).toBe(0);
      expect(d.isRoot()).toBe(true);
      expect(d.isLeaf()).toBe(true);
    });
  });

  describe("add child test", () => {
    it("leaf가 아닌 노드 a에 자식이 1개 있을 때 자식을 추가하면 a의 자식은 2개가 된다.", () => {
      const { root, a } = buildSampleTree();
      const d = new Tree({ id: "d", node: "D" });

      a.addChild(d); // a -> c, d

      expect(a.children).toHaveLength(2);
      expect(a.children).toContain(d);
      expect(d.parent).toBe(a);
      expect(root.depth).toBe(2); // root - a - c, d
      expect(root.size).toBe(5);
    });

    it("이미 부모가 있는 노드 c를 다른 부모 b에 addChild 하면 a의 자식은 없고, c의 부모는 b가 된다.", () => {
      const { a, b, c } = buildSampleTree();
      b.addChild(c);

      expect(b.children).toContain(c);
      expect(a.children).toHaveLength(0);
      expect(c.parent).toBe(b);
    });
  });

  describe("find test", () => {
    it("c 노드를 찾으면 c노드가 결과로 응답된다.", () => {
      const { root, c } = buildSampleTree();
      expect(root.findNodeById("c")).toBe(c);
    });

    it("트리에 없는 x 노드를 찾으면 undefined가 응답된다", () => {
      const { root } = buildSampleTree();
      expect(root.findNodeById("x")).toBeUndefined();
    });
  });

  describe("iterator test", () => {
    it("[Symbol.iterator]는 전위(Pre-order) 순회한다.", () => {
      const { root } = buildSampleTree();
      const ids = [...root].map((n) => n.id);
      expect(ids).toEqual(["root", "a", "c", "b"]);
    });

    it("postOrder()는 후위(Post-order) 순회한다.", () => {
      const { root } = buildSampleTree();
      const ids = [...root.postOrder()].map((n) => n.id);
      expect(ids).toEqual(["c", "a", "b", "root"]);
    });

    it("inOrder()는 중위(In-order) 순회한다.", () => {
      const { root } = buildSampleTree();
      const ids = [...root.inOrder()].map((n) => n.id);
      expect(ids).toEqual(["c", "a", "root", "b"]);
    });

    it("keys()와 values()는 전위(Pre-order) 순서로 반환한다.", () => {
      const { root } = buildSampleTree();
      expect([...root.keys()]).toEqual(["root", "a", "c", "b"]);
      expect([...root.values()]).toEqual(["R", "A", "C", "B"]);
    });
  });

  describe("remove child test", () => {
    describe("실패 테스트", () => {
      it("존재하지 않는 id면 삭제에 실패하고 NOT_FOUND가 반환된다.", () => {
        const { root } = buildSampleTree();
        expect(root.removeChild("x").status).toEqual("NOT_FOUND");
      });

      it("루트가 리프일 때 제거를 시도하면 삭제에 실패하고 ROOT_DISALLOWED기 반환된다.", () => {
        const root = new Tree({ id: "root", node: "R" });
        expect(root.removeChild("root").status).toEqual("ROOT_DISALLOWED");
      });

      it("자식이 있는 루트를 removeSubtrees 없이 제거 시도하면 ROOT_DISALLOWED", () => {
        const { root } = buildSampleTree();
        expect(root.removeChild("root").status).toEqual("ROOT_DISALLOWED");
      });
    });

    describe("성공 테스트", () => {
      it("removeSubtrees 옵션으로 루트의 하위트리를 모두 삭제하면 루트 노드만 남게 된다.", () => {
        const { root } = buildSampleTree();
        const res = root.removeChild("root", { removeSubtrees: true });

        expect(res.status).toEqual("ROOT_SUBTREES_REMOVED");
        expect(root.children).toHaveLength(0);
        expect(root.size).toBe(1);
      });

      it("중간 노드인 a를 제거(서브트리 유지)하면 a의 자식인 c가 root의 자식으로 붙고 a는 고아가 된다.", () => {
        const { root, a, c } = buildSampleTree();
        const res = root.removeChild("a", { removeSubtrees: false });

        expect(res.status).toEqual("REMOVED");

        // c가 root의 직계 자식이 된다.
        expect(c.parent).toBe(root);
        expect(root.children.map((n) => n.id)).toEqual(expect.arrayContaining(["b", "c"]));

        // a는 고아가 된다.
        expect(a.parent).toBeNull();
        expect(a.children).toHaveLength(0);
      });

      it("중간 노드인 a를 제거(서브트리 삭제)하면 하위트리가 완전히 사라진다", () => {
        const { root } = buildSampleTree();
        root.removeChild("a", { removeSubtrees: true });

        expect(root.findNodeById("a")).toBeUndefined();
        expect(root.findNodeById("c")).toBeUndefined();
        expect(root.size).toBe(2); // root + b
      });
    });
  });
});
