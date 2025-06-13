# 집합 (Set)

## 집합의 존재 이유

개발을 하다보면 두 가지 정보를 비교하여 특정 정보를 가져올 일이 빈번하게 일어난다.
예를 들면 client의 상태와 server 상태를 비교해서 달라진 부분만 체크표시를 할 때가 떠오르는데 이 경우 집합의 연산이 필요하게 된다. 이 때 두 상태를 주로 배열로 관리하게 되는데 배열의 메서드를 사용하여 비교할 시 교집합, 차집합을 연산할 때 비효율적으로 계산하게 된다. 그래서 이 때 집합 자료구조를 활용해서 개선해 볼 수 있다.

## 집합의 특징

- 순서나 키 없이 포함되는 원소를 모아둔다.
- 원소를 중복으로 저장하지 않는다.
- 합집합, 교집합 같은 수학의 집합 연산이 가능하다.
- 어떤 원소가 집합에 포함되었는지 검사할 수 있다.

이제는 집합 연산 별로 시간복잡도와 공간복잡도를 분석해보려고 한다. 대체로 배열을 사용할 때를 주로 설명하며, 집합을 사용해서 구현한 결과는 아래 구현 코드에 적어보려고 한다.

## 시간복잡도와 공간복잡도

### 1. 원소 찾기

집합의 특징 첫 번째로 순서나 키가 없이 포함되는 원소를 모아두게 된다.
그러므로 집합에서 특정 원소를 하나 찾는 것의 `시간복잡도는 O(1)`이며 원소의 크기가 N일 때 `공간복잡도는 N`이다.

배열을 사용할 때는 `Array.find`메서드를 사용해서 찾기 때문에 O(N)이 걸리는 반면 집합을 사용할 때는 O(1)으로 단축할 수 있다.

### 2. 원소 추가 및 삭제

집합에서 특정 원소를 추가하고 삭제하는 것또한 위와 비슷하게 `시간복잡도는 O(1)`이며 원소의 크기가 N일 때 `공간복잡도는 N`이다.

배열을 사용할 때 추가와 삭제에 대해 알아보면

먼저 추가는 `Array.push`를 사용해서 배열의 끝에 원소를 하나 추가하여 O(1)이 걸린다. 그러나 배열은 중복을 허용하므로 리스트를 순회하여 같은 값이 있는 경우 추가하지 않아야하므로 순회하는 시간인 O(N)이 걸리게 된다.

```js
const isDuplicate = list.find(element => element.id === id);
if (!isDuplicate) list.push(element);
```

다음으로 삭제는 먼저 삭제할 원소를 찾아야한다. `Array.findIndex`를 사용해서 삭제할 인덱스를 찾아야하므로 O(N)이 소요되고, 특정 요소의 이전과 이후의 배열을 각각 `Array.slice`를 사용해 자른 뒤 붙이는 연산이 필요하다. 이 과정에서 O(N)이 소요되어서 삭제할 때의 시간복잡도는 O(N)이 걸리게 된다.

```js
const prev = list.slice(0, index);
const next = list.slice(index + 1);
const newList = [...prev, ...next];
```

### 교집합

두 집합의 교집합을 구하는 상황을 생각해보자.

A집합과 B집합의 공통요소를 가져오려면 특정 집합을 하나 선택해 내부 원소 하나하나 다른 집합에 있는 원소인지 확인하는 연산이 필요하다.

이 때 A집합의 크기를 N, B집합의 크기를 M이라고 했을 때 N과 M중 작은 크기를 가진 A집합을 선택해(N < M이라 가정) 원소 하나하나 B집합에 포함되어 있는지를 검사하는 과정을 거친다. 그러므로 시간복잡도는 A집합을 순회하며 O(N) B집합에도 있는지 확인하므로 O(1) `총 O(N)`이 걸리게 된다. 공간복잡도는 두 집합을 사용하므로 `N + M`이다.

배열로 교집합을 구현하는 방법을 알아보면
먼저 크기가 작은 배열 a를 선택한 뒤 a의 원소 하나하나 순회하며 b집합에 같은 원소가 있는지를 체크하게 된다.
이 때 `Array.some`를 사용하여 동일한 원소가 있는지를 판별하며 이 메서드의 시간복잡도는 O(M)이다. a집합을 순회하며 O(N) b집합에 포함되어 있는지를 검사하므로 O(M) 총 `O(N * M)`이 걸리게 된다.

```js
const a = [{id: 1}, {id: 2}, {id: 3}];
const b = [{id: 2}, {id: 4}, {id: 5}, {id: 6}];

const intersection = a.filter(itemA => {
  return b.some(itemB => itemB.id === itemA.id);
});
```

### 차집합

두 집합의 차집합을 구하는 상황을 생각해보자. 이는 위의 교집합과 상당히 유사하다.
A집합과 B집합 중 A집합에만 포함된 요소를 가져오려면 A집합을 선택해 하나하나 B집합에 있는 원소인지 확인하는 연산이 필요하다.

이 때 A집합의 크기를 N, B집합의 크기를 M이라고 했을 때 A집합을 선택해 원소 하나하나 B집합에 포함되어 있는지를 검사하는 과정을 거친다. 그러므로 시간복잡도는 A집합을 순회하며 O(N) B집합에도 있는지 확인하므로 O(1) `총 O(N)`이 걸리게 된다. 공간복잡도는 두 집합을 사용하므로 `N + M`이다.

배열로 차집합을 구현하는 방법을 알아보면
먼저 a를 선택한 뒤 a의 원소 하나하나 순회하며 b집합에 같은 원소가 있는지를 체크하게 된다.
이 때 `Array.some`를 사용하여 동일한 원소가 있는지를 판별하며 이 메서드의 시간복잡도는 O(M)이다. a집합을 순회하며 O(N) b집합에 포함되어 있는지를 검사하므로 O(M) 총 `O(N * M)`이 걸리게 된다.

```js
const a = [{id: 1}, {id: 2}, {id: 3}];
const b = [{id: 2}, {id: 4}, {id: 5}, {id: 6}];

const differences = a.filter(itemA => {
  return !b.some(itemB => itemB.id === itemA.id);
});
```

## 합집합

이번엔 두 집합의 합집합을 구하는 상황을 생각해보자.

A집합과 B집합을 합칠 때 두 집합을 합치고 중복된 원소(교집합)을 제거해주면 된다.
A집합의 크기가 N, B집합의 크기가 M이라고 했을 때 두 집합을 하나의 집합으로 만들어주는 시간복잡도는 `O(N + M)`이 된다. (집합 자료구조의 특징으로 중복을 자동으로 제거해주기 때문에 교집합 연산을 추가로 해줄 필요는 없다.)
공간복잡도 역시 `N + M`이다

배열로 합집합을 구현하는 방법을 알아보면

먼저 A배열을 전개해서 앞에 추가해둔 뒤, B집합에만 있는 원소를(차집합) 전개 연산자로 추가해주면 합집합이 된다.
이 시간복잡도는 A배열을 전개하고 `O(N)` 차집합을 구해서 `O(N * M)` 합치므로 `O(N + N * M)`이 된다.

```js
const a = [{id: 1}, {id: 2}, {id: 3}];
const b = [{id: 2}, {id: 4}, {id: 5}, {id: 6}];

const union = [...a, ...b.filter(itemB => !a.some(itemA => itemA.id === itemB.id))];
```

## 코드 구현

위에서 배열로 집합을 다루는 코드를 적었다면 이제는 JS의 Set 자료형을 사용해서 구현해보도록 한다.
프론트엔드 개발을 하면서 객체형으로 데이터를 주로 다루기 때문에 객체형을 기본으로 생각하여 구현하도록 한다.

### 1. 원소 찾기

집합에서 원소를 하나 찾을 때 O(1)을 기대한다. 집합은 순서가 없고 중복을 허용하지 않기 때문이다. 그러나 JS의 Set을 사용하면 그럴 수가 없다. JS에서 원소가 포함되어있는지는 Set.has로 알 수 있지만 그 값을 가져오는 것은 어렵기 때문. 그래서 Set 클래스를 만들 때 map을 추가로 활용해서 특정 값을 O(1)로 가져올 수 있도록 구현했다.

클래스의 프로퍼티로 총 세 개를 사용했다.

key는 객체에서 고유값으로 관리하고 싶은 키 이름
keySet은 key로 설정한 값들의 Set
dataMap은 key와 key에 해당하는 실제 값의 map 객체이다.

```js
class KeyObjectSet<T extends Record<string | number, any>> {
  private key: keyof T;
  private keySet: Set<T[keyof T]>;
  private dataMap: Map<T[keyof T], T>;

  constructor(list: T[], key: keyof T) {
    if (!key) {
      throw new Error("원소의 고유한 key가 존재하지 않습니다.");
    }

    this.key = key;
    this.keySet = new Set();
    this.dataMap = new Map();

    for (const item of list) {
      const value = item[key];
      this.keySet.add(value);
      this.dataMap.set(value, item);
    }
  }

  find(value: T[keyof T]): T | undefined {
    return this.dataMap.get(value);
  }
}
```

아래는 find의 사용 예시이다.

```js
type DataType = { id: number; name: string };
const a: DataType[] = [
  { id: 1, name: "cookie" },
  { id: 2, name: "weadie" },
  { id: 3, name: "prune" },
];

const setA = new KeyObjectSet(a, "id");
console.log(setA.find(2)); // {"id": 2, "name": "weadie"}
```

### 2. 원소 추가, 삭제하기

하나의 원소를 추가하는 것은 keySet과 dataMap에 각각 현재 들어온 값을 추가해준다. 삭제하는 것도 동일한데 들어온 값을 keySet과 dataMap에서 찾아 제거해준다.

```js
add(item: T): void {
  const value = item[this.key];
  this.keySet.add(value);
  this.dataMap.set(value, item);
}

delete(value: T[keyof T]): void {
  this.keySet.delete(value);
  this.dataMap.delete(value);
}
```

### 3. 교집합

위에 서술한 교집합은 작은 집합을 찾아 순회하며 큰 집합에 속한지 확인 후 그렇다면 추가하는 것이다. 그러나 이를 실제로 사용할 때 고려해야 할 점이 있는데 현재 set과 other set에 같은 key가 있고 다른 값을 가질 경우이다.

예시를 들면 아래와 같은 경우인데 setA는 id: 1, name: cookie를 갖고 있고, setB는 id: 1, name: weadie를 갖고 있다.
여기서 교집합을 했을 때 내부 로직은 key인 id만으로 판별하기 때문에 어떤 값을 교집합으로 주어야할지 불명확해진다.

그래서 실제 교집합 구현에서는 함수를 호출하는 쪽인 setA를 기준으로 내보내준다. 그래서 아래 결과는 setA의 원소인 cookie를 반환하게 된다.

```js
const setA = new KeyObjectSet([{id: 1, name: 'cookie'}], 'id');
const setB = new KeyObjectSet([{id: 1, name: 'weadie'}], 'id');

console.log(setA.intersection(setB)); // cookie일까 weadie일까?
```

이를 구현한 결과는

```js
intersection(otherSet: KeyObjectSet<T>): KeyObjectSet<T> {
  const smaller = this.size() < otherSet.size() ? this : otherSet;
  const larger = this.size() < otherSet.size() ? otherSet : this;

  const resultSet = new KeyObjectSet<T>([], this.key);

  for (const key of this.keySet) {
    if (otherSet.has(key)) {
      const item = this.dataMap.get(key);
      if (item) resultSet.add(item);
    }
  }

  return resultSet;
}
```

아래는 intersection의 사용 예시이다.

```js
type DataType = { id: number; name: string };
const a: DataType[] = [
  { id: 1, name: "cookie" },
  { id: 2, name: "weadie" },
  { id: 3, name: "prune" },
];

const b: DataType[] = [
  { id: 1, name: "cookie" },
  { id: 4, name: "weadie" },
  { id: 5, name: "prune" },
];

const setA = new KeyObjectSet(a, "id");
const setB = new KeyObjectSet(b, "id");

console.log(setA.intersection(setB).values()); // {"id": 1, "name": "cookie"}
```

### 4. 차집합

위에 서술한 차집합의 구현을 정리하자면 현재 집합을 순회하며 다른 집합에 포함되어있지 않다면 추가하는 것이다.

이를 구현한 결과는

```js
difference(otherSet: KeyObjectSet<T>): KeyObjectSet<T> {
  const result = new KeyObjectSet<T>([], this.key);

  for (const key of this.keySet) {
    if (!otherSet.has(key)) {
      const item = this.dataMap.get(key);
      if (item) result.add(item);
    }
  }

  return result;
}
```

아래는 difference의 사용 예시이다.

```js
type DataType = { id: number; name: string };
const a: DataType[] = [
  { id: 1, name: "cookie" },
  { id: 2, name: "weadie" },
  { id: 3, name: "prune" },
];

const b: DataType[] = [
  { id: 1, name: "cookie" },
  { id: 4, name: "weadie" },
  { id: 5, name: "prune" },
];

const setA = new KeyObjectSet(a, "id");
const setB = new KeyObjectSet(b, "id");

console.log(setA.difference(setB).values()); // [{"id": 2, "name": "weadie"}, {"id": 3, "name": "prune"}]
```

### 5. 합집합

합집합은 현재 set에 다른 집합의 내용을 순회하며 현재 set에 추가해주는 방식으로 구현했다. 그러나 이 역시 intersection과 비슷하게 실제로 사용할 때 고려해야 할 점이 있는데 현재 set과 other set에 같은 key가 있고 다른 값을 가질 경우이다.

예시를 들면 아래와 같은 경우인데 setA는 id: 1, name: cookie를 갖고 있고, setB는 id: 1, name: weadie를 갖고 있다.
여기서 교집합을 했을 때 내부 로직은 key인 id만으로 판별하기 때문에 어떤 값을 합집합으로 해야할지 애매해진다.

그래서 실제 합집합 구현에서는 함수를 호출하는 쪽인 setA를 기준으로 합친다. 그래서 먼저 setA의 값을 먼저 추가한 뒤 setB를 순회하며 setA에 없는 값만 추가해주는 방식으로 구현했다.

이를 구현한 결과는

```js
  union(otherSet: KeyObjectSet<T>): KeyObjectSet<T> {
    const result = new KeyObjectSet<T>(this.values(), this.key);

    for (const item of this.values()) {
      result.add(item);
    }

    for (const item of otherSet.values()) {
      const keyValue = item[this.key];
      if (!this.has(keyValue)) {
        result.add(item);
      }
    }

    return result;
  }
```

아래는 union의 사용 예시이다.

```js
type DataType = { id: number; name: string };
const a: DataType[] = [
  { id: 1, name: "cookie" },
  { id: 2, name: "weadie" },
  { id: 3, name: "prune" },
];

const b: DataType[] = [
  { id: 1, name: "weadie" },
  { id: 4, name: "sunday" },
  { id: 5, name: "soosoo" },
];

const setA = new KeyObjectSet(a, "id");
const setB = new KeyObjectSet(b, "id");

console.log(setA.union(setB).values()); //[{"id": 1, "name": "cookie"}, {"id": 2, "name": "weadie"}, {"id": 3, "name": "prune"}, {"id": 4, "name": "sunday"}, {"id": 5, "name": "soosoo"}]
```
