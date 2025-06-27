import { Tree } from "../Tree";

const serial = <T>(tree: Tree<T>) => [...tree].map((n) => `${n.id}:${n.node as string}`).join(" > ");

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

describe("Tree Scenario Test", () => {
  let tree: ReturnType<typeof buildSampleTree>;

  beforeEach(() => {
    tree = buildSampleTree();
  });

  describe("1. find scenario", () => {
    it("루트에서 id 'c'를 찾으면 C 노드가 나온다", () => {
      expect(tree.root.findNodeById("c")).toBe(tree.c);
      expect(tree.root.findNodeById("c")?.node).toBe("C");
    });

    it("존재하지 않는 id를 찾으면 undefined를 돌려준다", () => {
      expect(tree.root.findNodeById("x")).toBeUndefined();
    });
  });

  describe("2. add scenario", () => {
    it("c 밑에 d를 추가하면 depth가 3, size가 5가 된다", () => {
      const d = new Tree({ id: "d", node: "D" });
      tree.c.addChild(d);

      expect(tree.root.depth).toBe(3); // root-a-c-d
      expect(tree.root.size).toBe(5);
      expect(serial(tree.root)).toBe("root:R > a:A > c:C > d:D > b:B");
    });

    it("트리 외부에 있던 c를 b 밑으로 이동(addChild)해도 size는 그대로 4이고 구조가 바뀐다", () => {
      tree.b.addChild(tree.c); // c의 새 부모를 b로 변경

      expect(tree.root.size).toBe(4);
      expect(tree.c.parent).toBe(tree.b);
      expect(serial(tree.root)).toBe("root:R > a:A > b:B > c:C");
    });
  });

  describe("3. remove scenario", () => {
    it("removeSubtrees 옵션 없이 a를 제거하면 c는 root의 자식으로 승격된다", () => {
      const res = tree.root.removeChild("a");

      expect(res.status).toEqual("REMOVED");
      expect(tree.root.children.map((v) => v.id)).toEqual(expect.arrayContaining(["b", "c"]));
      expect(serial(tree.root)).toBe("root:R > b:B > c:C");
      expect(tree.root.size).toBe(3);
      expect(tree.root.depth).toBe(1);
    });

    it("removeSubtrees=true 로 a를 제거하면 a·c 모두 사라지고 size는 2", () => {
      tree.root.removeChild("a", { removeSubtrees: true });

      expect(tree.root.findNodeById("a")).toBeUndefined();
      expect(tree.root.findNodeById("c")).toBeUndefined();
      expect(tree.root.size).toBe(2); // root, b
      expect(tree.root.depth).toBe(1);
      expect(serial(tree.root)).toBe("root:R > b:B");
    });

    it("루트 노드를 removeSubtrees=true 로 호출하면 하위 노드가 모두 삭제되고 루트만 남는다", () => {
      const res = tree.root.removeChild("root", { removeSubtrees: true });

      expect(res.status).toEqual("ROOT_SUBTREES_REMOVED");
      expect(tree.root.children).toHaveLength(0);
      expect(tree.root.size).toBe(1);
      expect(tree.root.depth).toBe(0);
    });

    it("루트 노드를 removeSubtrees 없이 제거하려 하면 ROOT_DISALLOWED 예외 코드가 난다", () => {
      const res = tree.root.removeChild("root");

      expect(res.status).toEqual("ROOT_DISALLOWED");
      expect(tree.root.size).toBe(4);
      expect(serial(tree.root)).toBe("root:R > a:A > c:C > b:B");
    });
  });

  describe("4. iterator & traversal scenario", () => {
    it("전위 순회(iterator) 결과는 [R, A, C, B] 순이다", () => {
      const nodes = [...tree.root].map((n) => n.node);
      expect(nodes).toEqual(["R", "A", "C", "B"]);
    });

    it("values() 역시 [R, A, C, B] 순을 돌려준다", () => {
      expect([...tree.root.values()]).toEqual(["R", "A", "C", "B"]);
    });

    it("inOrder()는 [C, A, R, B] 중위 순서다", () => {
      const nodes = [...tree.root.inOrder()].map((n) => n.node);
      expect(nodes).toEqual(["C", "A", "R", "B"]);
    });

    it("postOrder()는 후위 순회로 [C, A, B, R] 이다", () => {
      const nodes = [...tree.root.postOrder()].map((n) => n.node);
      expect(nodes).toEqual(["C", "A", "B", "R"]);
    });
  });
});
