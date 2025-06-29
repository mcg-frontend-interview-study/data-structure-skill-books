import {Heap} from '../heap';

describe('Heap Integration Test', () => {
  describe('Normal Scenario', () => {
    it('should behave correctly as a default minHeap', () => {
      const heap = new Heap<number>();

      expect(heap.empty()).toBe(true);

      heap.insert(20);
      heap.insert(5);
      heap.insert(10);
      expect(heap.size()).toBe(3);

      expect(heap.peek()).toBe(5);
      expect(heap.remove()).toBe(5);

      expect(heap.peek()).toBe(10);
      expect(heap.remove()).toBe(10);

      expect(heap.remove()).toBe(20);

      expect(heap.empty()).toBe(true);
    });

    it('should behave correctly as a maxHeap with "max" mode', () => {
      const heap = new Heap<number>('max');

      heap.insert(1);
      heap.insert(100);
      heap.insert(50);

      expect(heap.peek()).toBe(100);

      heap.insert(75);
      expect(heap.size()).toBe(4);

      expect(heap.remove()).toBe(100);
      expect(heap.remove()).toBe(75);
      expect(heap.size()).toBe(2);
      expect(heap.remove()).toBe(50);
      expect(heap.remove()).toBe(1);
    });

    it('should behave correctly with custom compareFn (reverse order)', () => {
      const heap = new Heap<number>((a, b) => b - a); // maxHeap

      heap.insert(3);
      heap.insert(1);
      heap.insert(2);

      expect(heap.remove()).toBe(3);
      expect(heap.remove()).toBe(2);

      heap.insert(5);
      expect(heap.peek()).toBe(5);
      expect(heap.remove()).toBe(5);
      expect(heap.remove()).toBe(1);
    });

    it('should handle object heap with keySelector and min mode', () => {
      type Task = {id: string; priority: number};
      const heap = new Heap(['min', (task: Task) => task.priority]);

      heap.insert({id: 'a', priority: 30});
      heap.insert({id: 'b', priority: 10});
      heap.insert({id: 'c', priority: 20});

      expect(heap.peek()).toEqual({id: 'b', priority: 10});
      expect(heap.remove()).toEqual({id: 'b', priority: 10});

      heap.insert({id: 'd', priority: 5});
      expect(heap.remove()).toEqual({id: 'd', priority: 5});
    });

    it('should handle object heap with keySelector and max mode', () => {
      type User = {name: string; score: number};
      const heap = new Heap(['max', (user: User) => user.score]);

      heap.insert({name: 'JS', score: 85});
      heap.insert({name: 'TS', score: 92});
      heap.insert({name: 'C', score: 88});

      expect(heap.size()).toBe(3);
      expect(heap.peek()).toEqual({name: 'TS', score: 92});

      expect(heap.remove()).toEqual({name: 'TS', score: 92});
      expect(heap.remove()).toEqual({name: 'C', score: 88});
      expect(heap.remove()).toEqual({name: 'JS', score: 85});
    });
  });

  describe('Edge Case Scenario', () => {
    it('should handle repeated identical values', () => {
      const heap = new Heap<number>();
      [7, 7, 7].forEach(v => heap.insert(v));

      expect(heap.remove()).toBe(7);
      expect(heap.remove()).toBe(7);

      heap.insert(7);
      expect(heap.peek()).toBe(7);
      expect(heap.remove()).toBe(7);
    });
  });

  describe('Extreme Value Scenario', () => {
    let extremeValues: number[];

    beforeEach(() => {
      extremeValues = [0, -1000, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Infinity];
    });

    const insertAll = (heap: Heap<number>, values: number[]) => {
      values.forEach(v => heap.insert(v));
    };

    it('should handle extreme values in minHeap', () => {
      const heap = new Heap<number>('min');
      insertAll(heap, extremeValues);

      const result = extremeValues.map(() => heap.remove());
      expect(result).toEqual([...extremeValues].sort((a, b) => a - b));
    });

    it('should handle extreme values in maxHeap', () => {
      const heap = new Heap<number>('max');
      insertAll(heap, extremeValues);

      const result = extremeValues.map(() => heap.remove());
      expect(result).toEqual([...extremeValues].sort((a, b) => b - a));
    });
  });
});
