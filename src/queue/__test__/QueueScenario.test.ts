import {STATUS_CODE} from '../../constants/statusCode';
import {Queue} from '../Queue';

describe('Queue Scenarios', () => {
  let queue: Queue<string | number>;

  beforeEach(() => {
    queue = new Queue<string | number>();
  });

  test('Scenario 1: Basic FIFO Queue operation (add and popFront)', () => {
    // 1. 요소 추가: 1, 2, 3
    queue.add(1);
    expect(queue.getSize()).toBe(1);
    expect(queue.isEmpty()).toBe(false);

    queue.add(2);
    expect(queue.getSize()).toBe(2);

    queue.add(3);
    expect(queue.getSize()).toBe(3);

    // 2. 맨 앞에서 요소 제거: 1, 2, 3 순서대로 나와야 함
    expect(queue.popFront()).toBe(1);
    expect(queue.getSize()).toBe(2);

    expect(queue.popFront()).toBe(2);
    expect(queue.getSize()).toBe(1);

    expect(queue.popFront()).toBe(3);
    expect(queue.getSize()).toBe(0);
    expect(queue.isEmpty()).toBe(true);

    // 3. 비어있는 큐에서 제거 시도
    expect(queue.popFront()).toBe(STATUS_CODE.FAIL);
    expect(queue.getSize()).toBe(0);
  });

  // --- 시나리오 2: LIFO 스택 동작 (addFront -> popFront) ---
  test('Scenario 2: LIFO Stack-like behavior (addFront and popFront)', () => {
    // 1. 맨 앞에 요소 추가: A, B, C (결과: C -> B -> A)
    queue.addFront('A');
    expect(queue.getSize()).toBe(1);

    queue.addFront('B'); // B -> A
    expect(queue.getSize()).toBe(2);

    queue.addFront('C'); // C -> B -> A
    expect(queue.getSize()).toBe(3);

    // 2. 맨 앞에서 요소 제거: C, B, A 순서대로 나와야 함 (Last-In, First-Out)
    expect(queue.popFront()).toBe('C');
    expect(queue.getSize()).toBe(2);

    expect(queue.popFront()).toBe('B');
    expect(queue.getSize()).toBe(1);

    expect(queue.popFront()).toBe('A');
    expect(queue.getSize()).toBe(0);
    expect(queue.isEmpty()).toBe(true);
  });

  // --- 시나리오 3: 덱(Deque)처럼 사용 (양쪽에서 추가/제거) ---
  test('Scenario 3: Deque-like behavior (add, addFront, pop, popFront mix)', () => {
    // 1. 다양한 방법으로 요소 추가
    queue.add(10); // [10] (tail=10, head=10)
    queue.addFront(5); // [5, 10] (tail=10, head=5)
    queue.add(20); // [5, 10, 20] (tail=20, head=5)
    queue.addFront(1); // [1, 5, 10, 20] (tail=20, head=1)
    expect(queue.getSize()).toBe(4);

    // 2. 양쪽에서 제거하며 상태 확인
    expect(queue.popFront()).toBe(1); // [5, 10, 20]
    expect(queue.getSize()).toBe(3);

    expect(queue.pop()).toBe(20); // [5, 10]
    expect(queue.getSize()).toBe(2);

    expect(queue.popFront()).toBe(5); // [10]
    expect(queue.getSize()).toBe(1);

    expect(queue.pop()).toBe(10); // []
    expect(queue.getSize()).toBe(0);
    expect(queue.isEmpty()).toBe(true);

    // 3. 완전히 비워진 후 추가 및 제거 재시도
    queue.add(100);
    expect(queue.getSize()).toBe(1);
    expect(queue.popFront()).toBe(100);
    expect(queue.getSize()).toBe(0);
    expect(queue.pop()).toBe(STATUS_CODE.FAIL);
  });

  // --- 시나리오 4: 큐에 많은 요소 추가 및 제거 (성능 또는 안정성 간단 확인) ---
  test('Scenario 4: Adding and removing many elements', () => {
    const numElements = 1000;

    // 1. 많은 요소 추가
    for (let i = 0; i < numElements; i++) {
      queue.add(i);
    }
    expect(queue.getSize()).toBe(numElements);

    // 2. 모든 요소 제거 (popFront)
    for (let i = 0; i < numElements; i++) {
      expect(queue.popFront()).toBe(i);
    }
    expect(queue.getSize()).toBe(0);
    expect(queue.isEmpty()).toBe(true);

    // 3. 다시 많은 요소 추가 (addFront)
    for (let i = 0; i < numElements; i++) {
      queue.addFront(i);
    }
    expect(queue.getSize()).toBe(numElements);

    // 4. 모든 요소 제거 (pop)
    for (let i = 0; i < numElements; i++) {
      expect(queue.pop()).toBe(i); // 역순으로 제거
    }
    expect(queue.getSize()).toBe(0);
    expect(queue.isEmpty()).toBe(true);
  });
});
