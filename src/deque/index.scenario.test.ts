import {Deque} from './index';

describe('Deque 시나리오 테스트', () => {
  it('오른쪽에 1, 2, 3을 차례대로 추가하면 크기는 3이고 요소는 [1, 2, 3]이 되어야 한다', () => {
    const deque = new Deque<number>();
    deque.appendRight(1);
    deque.appendRight(2);
    deque.appendRight(3);

    expect(deque.size).toBe(3);
    expect([...deque]).toEqual([1, 2, 3]);
  });

  it('초기값 [1, 2, 3]에서 오른쪽에서 3, 왼쪽에서 1을 제거하면 남은 요소는 [2]이고 크기는 1이어야 한다', () => {
    const deque = new Deque<number>([1, 2, 3]);
    const popRight = deque.popRight(); // 오른쪽에서 3 제거
    const popLeft = deque.popLeft(); // 왼쪽에서 1 제거

    expect(popRight).toBe(3);
    expect(popLeft).toBe(1);
    expect(deque.size).toBe(1);
    expect([...deque]).toEqual([2]);
  });

  it('왼쪽과 오른쪽에 번갈아 추가하고 제거하는 동작을 올바르게 처리해야 한다', () => {
    const deque = new Deque<number>();
    deque.appendLeft(10); // 왼쪽에 10 추가
    deque.appendRight(20); // 오른쪽에 20 추가
    deque.appendLeft(5); // 왼쪽에 5 추가

    expect(deque.size).toBe(3);
    expect([...deque]).toEqual([5, 10, 20]);

    const popRight = deque.popRight(); // 오른쪽에서 20 제거
    expect(popRight).toBe(20);

    const popLeft = deque.popLeft(); // 왼쪽에서 5 제거
    expect(popLeft).toBe(5);

    expect(deque.size).toBe(1);
    expect([...deque]).toEqual([10]);
  });
});
