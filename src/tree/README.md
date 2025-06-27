## 이름

Tree

## 트리 자료구조의 목적

트리 자료구조는 같은 형태의 노드가 부모 자식간의 관계를 갖는 구조를 관리할 때 다루면 좋을 자료구조입니다.

트리는 그래프를 표현하는 자료구조 중 하나이며 사이클이 없고 상하 관계를 맺는 특징이 있습니다.

트리 자료구조를 사용하는 예시를 들자면 게시글의 댓글과 대댓글을 관리할 때 사용할 수 있습니다.

이 트리는 이진트리가 아니라 가장 기본적인 트리입니다. 그래서 노드의 자식으로 올 수 있는 개수제한이 없습니다.

## 기능

- constructor: 현재 노드의 id와 정보를 담을 node 두 가지 프로퍼티를 받는다.
- parent: 현재 노드의 부모 노드를 알 수 있다. 외부에서 직접 parent를 수정할 수 없다.
- children: 현재 노드의 자식 노드들을 알 수 있다. 외부에서 직접 children을 수정할 수 없다.
- isRoot: 현재 노드가 루트 노드인지 알 수 있는 메서드
- isLeaf: 현재 노드가 리프 노드인지 알 수 있는 메서드
- addChild: 특정 노드를 해당 노드의 자식으로 추가하는 메서드
- findNodeById: 트리 내에서 특정 노드를 찾는 메서드, 특정 노드가 있으면 노드를 반환 그렇지 않으면 undefined 반환
- removeChild: 트리에서 특정 노드를 지우는 메서드. 특정 노드를 지웠을 때 특정 노드의 하위 트리를 같이 삭제하는 removeSubTrees 옵션이 있음. true이면 같이 삭제, false이면 하위 트리를 특정 노드의 부모의 자식으로 붙음.
- iterator: 전위순회(pre-order)를 기본으로 트리를 순회하는 메서드. `for node of tree`로 pre-order를 사용할 수 있다.
- postOrder: 후위순회(post-order)로 트리를 순회하는 메서드.
- keys: 트리의 key인 id정보만을 얻을 수 있는 메서드
- values: 트리의 value인 node정보만을 얻을 수 있는 메서드
- depth: 현재 트리의 깊이를 알 수 있는 기능
- size: 현재 트리의 노드 개수를 알 수 있는 기능

## 시간복잡도

현재 트리의 노드 수가 N개일 때의 각 메서드 별로 시간복잡도를 정리해보면

| 작업 / API               | 시간복잡도 |
| ------------------------ | ---------- |
| isRoot()                 | 1          |
| isLeaf()                 | 1          |
| addChild(child)          | 1          |
| findNodeById(id)         | N          |
| removeChild(id, options) | N          |
| [Symbol.iterator]()      | N          |
| postOrder()              | N          |
| keys()                   | N          |
| values()                 | N          |
| depth getter             | N          |
| size getter              | N          |

## 사용예시

### 1. constructor

```ts
const tree = new Tree({ id: "a", node: "a" });
```

### 2. parent

```ts
const tree = new Tree({ id: "a", node: "a" });
console.log(tree.parent); // null
```

### 3. children

```ts
const tree = new Tree({ id: "a", node: "a" });
console.log(tree.children); // []
```

### 4. isRoot

```ts
const tree = new Tree({ id: "a", node: "a" });
console.log(tree.isRoot()); // true
```

### 5. isLeaf

```ts
const tree = new Tree({ id: "a", node: "a" });
console.log(tree.isLeaf()); // true
```

### 6. addChild

```ts
const parent = new Tree({ id: "a", node: "a" });
const child = new Tree({ id: "b", node: "b" });

parent.addChild(child);
console.log(parent.children); // [Tree { id: "b", ... }]
console.log(child.parent); // Tree { id: "a", ... }
```

### 7. findByNodeId

```ts
const a = new Tree({ id: "a", node: "a" });
const b = new Tree({ id: "b", node: "b" });
const c = new Tree({ id: "c", node: "c" });
a.addChild(b);
b.addChild(c);

const found = a.findNodeById("c");
console.log(found?.id); // "c"
```

### 8. removeChild

```ts
const a = new Tree({ id: "a", node: "a" });
const b = new Tree({ id: "b", node: "b" });
const c = new Tree({ id: "c", node: "c" });

a.addChild(b);
b.addChild(c);

const result = a.removeChild("b");
console.log(result); // { code: 0, status: "REMOVED" }
console.log(a.children.map((n) => n.id)); // ["c"]
```

### 9. iterator (for...of) 전위순회 pre-order

```ts
const a = new Tree({ id: "a", node: "a" });
const b = new Tree({ id: "b", node: "b" });
const c = new Tree({ id: "c", node: "c" });
const d = new Tree({ id: "d", node: "d" });
const e = new Tree({ id: "e", node: "e" });

a.addChild(b);
a.addChild(c);
b.addChild(d);
b.addChild(e);

const order = [];
for (const node of a) {
  order.push(node.id);
}

console.log(order.join(" ")); // a b d e c
```

### 10. 중위순회 in-order

```ts
const a = new Tree({ id: "a", node: "a" });
const b = new Tree({ id: "b", node: "b" });
const c = new Tree({ id: "c", node: "c" });
const d = new Tree({ id: "d", node: "d" });
const e = new Tree({ id: "e", node: "e" });

a.addChild(b);
a.addChild(c);
b.addChild(d);
b.addChild(e);

const order = [];
for (const node of a.inOrder()) {
  order.push(node.id);
}

console.log(order.join(" ")); // d b e a c
```

### 11. 후위순회 post-order

```ts
const a = new Tree({ id: "a", node: "a" });
const b = new Tree({ id: "b", node: "b" });
const c = new Tree({ id: "c", node: "c" });
const d = new Tree({ id: "d", node: "d" });
const e = new Tree({ id: "e", node: "e" });

a.addChild(b);
a.addChild(c);
b.addChild(d);
b.addChild(e);

const order = [];
for (const node of a.inOrder()) {
  order.push(node.id);
}

console.log(order.join(" ")); // d e b c a
```

### 12. keys or values

```ts
const a = new Tree({ id: "a", node: "a" });
const b = new Tree({ id: "b", node: "b" });
const c = new Tree({ id: "c", node: "c" });
const d = new Tree({ id: "d", node: "d" });
const e = new Tree({ id: "e", node: "e" });

a.addChild(b);
a.addChild(c);
b.addChild(d);
b.addChild(e);

console.log([...a.keys()]); // a b d e c
console.log([...a.values()]); // a b d e c
```

### 13. depth

```ts
const a = new Tree({ id: "a", node: "a" });
const b = new Tree({ id: "b", node: "b" });
const c = new Tree({ id: "c", node: "c" });
const d = new Tree({ id: "d", node: "d" });
const e = new Tree({ id: "e", node: "e" });

a.addChild(b);
a.addChild(c);
b.addChild(d);
b.addChild(e);

console.log(a.depth); // 2
```

### 14. size

```ts
const a = new Tree({ id: "a", node: "a" });
const b = new Tree({ id: "b", node: "b" });
const c = new Tree({ id: "c", node: "c" });
const d = new Tree({ id: "d", node: "d" });
const e = new Tree({ id: "e", node: "e" });

a.addChild(b);
a.addChild(c);
b.addChild(d);
b.addChild(e);

console.log(a.size); // 5
```

## 테스트 커버리지

테스트 항목은 다음과 같다.

- Tree unit test (100% coverage)
- Tree scenario test (100% coverage)

PASS src/tree/**test**/Tree.scenario.test.ts
PASS src/tree/**test**/Tree.test.ts
-------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------|---------|----------|---------|---------|-------------------
All files | 100 | 100 | 100 | 100 |  
 tree | 100 | 100 | 100 | 100 |  
 Tree.ts | 100 | 100 | 100 | 100 |  
-------------|---------|----------|---------|---------|-------------------

## 느낀점

- 오랜만에 전위순회, 중위순회, 후위순회를 구현하려니 헷갈렸던....
- 트리를 편하게 순회할 수 있도록 for .. of ~ 를 사용할 수 있도록 하는 방법을 찾아보면서 symbol.iterator와 yield를 적용했고 이터레이터에 대해서 알 수 있었다. 개발하면서 symbol을 어디에 쓰지 했었는데 바로 여기에서 쓰인다는 점을 겪을 수 있었다.
