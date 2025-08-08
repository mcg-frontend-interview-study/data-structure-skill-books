import {COMPARISON_RESULT, defaultNumberComparator} from '../../bst/utils/comparator';
import {PriorityQueue} from './../PriorityQueue';

describe('PriorityQueue', () => {
  describe('desc 힙', () => {
    let maxHeap;

    beforeEach(() => {
      maxHeap = new PriorityQueue(defaultNumberComparator, 'desc');
    });

    it('큰 값을 top에 유지한다.', () => {
      maxHeap.insert(10);
      expect(maxHeap.top()).toBe(10);

      maxHeap.insert(20);
      expect(maxHeap.top()).toBe(20);

      maxHeap.insert(5);
      expect(maxHeap.top()).toBe(20);
      expect(maxHeap.getSize()).toBe(3);
    });

    it('내림차순 뽑기', () => {
      maxHeap.insert(10);
      maxHeap.insert(5);
      maxHeap.insert(20);
      maxHeap.insert(8);
      maxHeap.insert(15);

      expect(maxHeap.pop()).toBe(20);
      expect(maxHeap.pop()).toBe(15);
      expect(maxHeap.pop()).toBe(10);
      expect(maxHeap.pop()).toBe(8);
      expect(maxHeap.pop()).toBe(5);
      expect(maxHeap.isEmpty()).toBe(true);
    });

    it('중복이 있어도 우큐 특성 유지', () => {
      maxHeap.insert(10);
      maxHeap.insert(5);
      maxHeap.insert(10);

      expect(maxHeap.top()).toBe(10);
      expect(maxHeap.pop()).toBe(10);
      expect(maxHeap.top()).toBe(10);
      expect(maxHeap.pop()).toBe(10);
      expect(maxHeap.top()).toBe(5);
    });
  });

  describe('asc 힙', () => {
    let minHeap;

    beforeEach(() => {
      minHeap = new PriorityQueue(defaultNumberComparator, 'asc');
    });

    it('작은 값을 top에 유지한다.', () => {
      minHeap.insert(10);
      expect(minHeap.top()).toBe(10);

      minHeap.insert(20);
      expect(minHeap.top()).toBe(10);

      minHeap.insert(5);
      expect(minHeap.top()).toBe(5);
      expect(minHeap.getSize()).toBe(3);
    });

    it('오름차순 뽑기', () => {
      minHeap.insert(10);
      minHeap.insert(5);
      minHeap.insert(20);
      minHeap.insert(8);
      minHeap.insert(15);

      expect(minHeap.pop()).toBe(5);
      expect(minHeap.pop()).toBe(8);
      expect(minHeap.pop()).toBe(10);
      expect(minHeap.pop()).toBe(15);
      expect(minHeap.pop()).toBe(20);
      expect(minHeap.isEmpty()).toBe(true);
    });
  });

  describe('커스텀한 comparator', () => {
    const customComparator = (a, b) => {
      if (a.priority < b.priority) return COMPARISON_RESULT.LESS_THAN;
      if (a.priority > b.priority) return COMPARISON_RESULT.GREATER_THAN;
      return COMPARISON_RESULT.EQUAL;
    };

    it('desc', () => {
      const taskQueue = new PriorityQueue(customComparator, 'desc');

      const a = {name: 'a', priority: 5};
      const b = {name: 'b', priority: 10};
      const c = {name: 'c', priority: 2};

      taskQueue.insert(a);
      taskQueue.insert(b);
      taskQueue.insert(c);

      expect(taskQueue.getSize()).toBe(3);
      expect(taskQueue.top()).toEqual({name: 'b', priority: 10});

      expect(taskQueue.pop()).toEqual(b);
      expect(taskQueue.pop()).toEqual(a);
      expect(taskQueue.pop()).toEqual(c);
    });
  });

  describe('edge', () => {
    it('빈 queue pop은 falsy', () => {
      const pq = new PriorityQueue(defaultNumberComparator);
      expect(pq.pop()).toBeUndefined();
    });

    it('빈 queue top은 falsy', () => {
      const pq = new PriorityQueue(defaultNumberComparator);
      expect(pq.top()).toBeUndefined();
    });
  });
});
