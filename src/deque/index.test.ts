import {Deque} from './Deque';

describe('Deque unit test', () => {
  describe('Deque.constructor', () => {
    test('정상값: 배열 초기화 시 순서를 유지한다', () => {
      const deque = new Deque([1, 2, 3]);
      expect([...deque]).toEqual([1, 2, 3]);
      expect(deque.size).toBe(3);
    });

    test('경계값: 빈 배열로 초기화하면 size는 0', () => {
      const deque = new Deque([]);
      expect(deque.size).toBe(0);
      expect([...deque]).toEqual([]);
    });
  });

  describe('Deque.prototype.appendLeft', () => {
    test('정상값: 왼쪽에 요소를 추가하면 맨 앞에 삽입된다', () => {
      const deque = new Deque([2, 3]);
      deque.appendLeft(1);
      expect([...deque]).toEqual([1, 2, 3]);
    });

    test('경계값: 빈 덱에 appendLeft하면 첫 요소가 된다', () => {
      const deque = new Deque();
      deque.appendLeft(10);
      expect([...deque]).toEqual([10]);
      expect(deque.size).toBe(1);
    });

    test('예외값: undefined나 null을 삽입해도 작동한다', () => {
      const deque = new Deque();
      deque.appendLeft(undefined);
      deque.appendLeft(null);
      expect([...deque]).toEqual([null, undefined]);
    });
  });

  describe('Deque.prototype.appendRight', () => {
    test('정상값: 오른쪽에 요소를 추가하면 맨 뒤에 삽입된다', () => {
      const deque = new Deque([1, 2]);
      deque.appendRight(3);
      expect([...deque]).toEqual([1, 2, 3]);
    });

    test('경계값: 빈 덱에 appendRight하면 첫 요소가 된다', () => {
      const deque = new Deque();
      deque.appendRight(99);
      expect([...deque]).toEqual([99]);
      expect(deque.size).toBe(1);
    });

    test('예외값: 객체나 NaN 등 다양한 값도 삽입 가능', () => {
      const deque = new Deque();
      deque.appendRight({a: 1});
      deque.appendRight(NaN);
      expect(deque.size).toBe(2);
    });
  });

  describe('Deque.prototype.popLeft', () => {
    test('정상값: 왼쪽 요소를 제거하고 반환한다', () => {
      const deque = new Deque([1, 2, 3]);
      expect(deque.popLeft()).toBe(1);
      expect([...deque]).toEqual([2, 3]);
    });

    test('경계값: 요소 1개일 때 popLeft하면 빈 덱이 된다', () => {
      const deque = new Deque([42]);
      expect(deque.popLeft()).toBe(42);
      expect(deque.size).toBe(0);
    });

    test('예외값: 빈 덱에서 popLeft는 undefined 반환', () => {
      const deque = new Deque();
      expect(deque.popLeft()).toBeUndefined();
    });
  });

  describe('Deque.prototype.popRight', () => {
    test('정상값: 오른쪽 요소를 제거하고 반환한다', () => {
      const deque = new Deque([1, 2, 3]);
      expect(deque.popRight()).toBe(3);
      expect([...deque]).toEqual([1, 2]);
    });

    test('경계값: 요소 1개일 때 popRight하면 빈 덱이 된다', () => {
      const deque = new Deque([88]);
      expect(deque.popRight()).toBe(88);
      expect(deque.size).toBe(0);
    });

    test('예외값: 빈 덱에서 popRight는 undefined 반환', () => {
      const deque = new Deque();
      expect(deque.popRight()).toBeUndefined();
    });
  });

  describe('Deque.prototype.rotate', () => {
    test('정상값: 양수는 오른쪽으로 회전', () => {
      const deque = new Deque([1, 2, 3, 4]);
      deque.rotate(1); // → [4, 1, 2, 3]
      expect([...deque]).toEqual([4, 1, 2, 3]);
    });

    test('정상값: 음수는 왼쪽으로 회전', () => {
      const deque = new Deque([1, 2, 3, 4]);
      deque.rotate(-2); // ← [3, 4, 1, 2]
      expect([...deque]).toEqual([3, 4, 1, 2]);
    });

    test('경계값: 0을 회전하면 상태 변화 없음', () => {
      const deque = new Deque([1, 2, 3]);
      deque.rotate(0);
      expect([...deque]).toEqual([1, 2, 3]);
    });

    test('예외값: |n| > size 이면 에러 발생', () => {
      const deque = new Deque([1, 2]);
      expect(() => deque.rotate(3)).toThrow();
      expect(() => deque.rotate(-5)).toThrow();
    });

    test('경계값: |n| === size는 유효하며 원래 상태와 같음', () => {
      const deque = new Deque([1, 2, 3]);
      deque.rotate(3); // 전체 회전
      expect([...deque]).toEqual([1, 2, 3]);
    });
  });

  describe('Deque.prototype.size (getter)', () => {
    test('초기값에서 size 확인', () => {
      const deque = new Deque([1, 2, 3]);
      expect(deque.size).toBe(3);
    });

    test('변경 후 size가 반영된다', () => {
      const deque = new Deque();
      deque.appendRight(10);
      expect(deque.size).toBe(1);
      deque.popLeft();
      expect(deque.size).toBe(0);
    });
  });

  describe('[Symbol.iterator]', () => {
    test('정상값: for...of로 순회 가능', () => {
      const deque = new Deque([1, 2, 3]);
      const result = [];
      for (const val of deque) {
        result.push(val);
      }
      expect(result).toEqual([1, 2, 3]);
    });

    test('경계값: 빈 덱은 순회해도 아무 값도 나오지 않음', () => {
      const deque = new Deque();
      const result = [...deque];
      expect(result).toEqual([]);
    });
  });
});
