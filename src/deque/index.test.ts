import {Deque} from './index';

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

    test('예외값: undefined나 null을 삽입하면 빈 값이다. (undefined, null을 허용하지 않음)', () => {
      const deque = new Deque();
      deque.appendLeft(undefined);
      deque.appendLeft(null);
      expect([...deque]).toEqual([]);
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

    test('예외값: 객체도 삽입 가능하다. (빈 값은 불가능)', () => {
      const deque = new Deque();
      deque.appendRight({a: 1});
      expect(deque.size).toBe(1);
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
      const result: number[] = [];
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
