# 덱 (Deque)

## 덱의 존재 이유

개발을 할 때 우리는 은연 중에 Queue를 자주 사용하게 된다.
대표적으로 브라우저의 대기 큐들이나 입력 버퍼, TCP의 window 등 Queue라는 자료구조를 자주 사용하게 된다.
Queue는 선입선출의 특징을 갖고 순차적으로 저장이 이루어진다.

그러나 Queue를 사용하면서 그 동시에 그 반대 방향으로도 자료를 꺼낼 필요가 있는 상황도 있다.
예를 들어 웹 브라우저의 히스토리를 관리할 때 이전 페이지, 다음 페이지를 이동하는 상황을 구현할 때 양방향으로 접근할 수 있다면, 사용자가 뒤로 가기 버튼이나 앞으로 가기 버튼을 눌렀을 때, 이전 방문 기록이나 다음 방문 기록으로 쉽게 이동할 수 있게 된다.

이에 양방향으로 데이터를 삽입 삭제할 수 있는 자료구조가 필요하고 그것이 덱이다.
Stack과 Queue를 섞은 자료구조라고 생각해도 좋을 듯하다.

## 덱의 특징

덱의 내부는 노드의 연결리스트 Linked List로 이루어져있다.
다만 Linked List는 중간 노드를 삭제하고 추가할 수 있지만 Deque는 양 끝에서만 삽입 삭제가 일어난다.
데이터를 삽입하고 삭제하는 시간복잡도는 총 O(1)이 들며, 특정 데이터를 찾는 방법은 인덱스로 접근할 수 없고 Linked List를 순회하여 찾아야하기 때문에 O(N)이 소요된다.

## API

### Deque.constructor

```js
const deque1 = new Deque();
const deque2 = new Deque([1, 2, 3]);
```

덱 자료구조를 만들어주는 역할을 한다.
인자로는 비어있을 수 있고 배열을 받을 수도 있다.
비어있을 경우 size가 0인 Deque를 만들고, 배열을 받을 경우 size가 배열의 length이고 각 배열 원소가 순차적으로 저장되는 Deque를 만들게 된다.

- Time Complexity - O(N)
- Space Complexity - O(N)

### Deque.prototype.appendLeft

```js
const deque = new Deque();
deque.appendLeft([1]);
```

덱의 왼쪽으로 데이터를 삽입하는 기능이다.
삽입 후 Deque의 size가 1 증가한다.
Action 성공 실패에 따른 Status를 return으로 제공한다.

- Time Complexity - O(1)
- Space Complexity - O(N)

### Deque.prototype.appendRight

```js
const deque = new Deque();
deque.appendRight([1]);
```

덱의 오른쪽으로 데이터를 삽입하는 기능이다.
삽입 후 Deque의 size가 1 증가한다.
Action 성공 실패에 따른 Status를 return으로 제공한다.

- Time Complexity - O(1)
- Space Complexity - O(N)

### Deque.prototype.popLeft

```js
const deque = new Deque([1]);
deque.popLeft();
```

덱의 왼쪽에서 데이터를 빼는 기능이다.
제거 후 Deque의 size가 1 감소한다.
만일 Deque가 빈 상태에서 popLeft를 수행하면 undefined를 반환한다.

- Time Complexity - O(1)
- Space Complexity - O(N)

### Deque.prototype.popRight

```js
const deque = new Deque([1]);
deque.popRight();
```

덱의 오른쪽에서 데이터를 빼는 기능이다.
제거 후 Deque의 size가 1 감소한다.
만일 Deque가 빈 상태에서 popLeft를 수행하면 undefined를 반환한다.

- Time Complexity - O(1)
- Space Complexity - O(N)

### Deque.prototype.size

```js
const deque = new Deque([1]);
console.log(deque.size);
```

덱의 현재 길이를 알 수 있는 프로퍼티
덱의 현재 길이를 반환해준다.

### [Symbol.iterator]()

```js
const deque = new Deque([1, 2, 3]);

for (const node of deque) {
  console.log(node);
}
```

덱을 순회할 수 있는 기능이다.
왼쪽에서 오른쪽으로 순회하여 데이터를 얻을 수 있다.
반대로 하는 기능도 구현하고 싶지만 내부 Linked List가 단방향을 지원하므로 우선 왼쪽에서 오른쪽을 우선으로 구현했다.

- Time Complexity - O(N)
- Space Complexity - O(N)
