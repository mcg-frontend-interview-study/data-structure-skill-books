import {Heap} from './../heap';
import {STATUS_CODE} from '../../constants/statusCode';

describe('Heap Unit Test', () => {
  describe('constructor', () => {
    it('should default to minHeap when no argument is passed', () => {
      const heap = new Heap<number>();
      heap.insert(5);
      heap.insert(2);
      heap.insert(8);

      expect(heap.remove()).toBe(2);
      expect(heap.remove()).toBe(5);
      expect(heap.remove()).toBe(8);
    });

    it('should behave as maxHeap when "max" is passed', () => {
      const heap = new Heap<number>('max');
      heap.insert(5);
      heap.insert(2);
      heap.insert(8);

      expect(heap.remove()).toBe(8);
      expect(heap.remove()).toBe(5);
      expect(heap.remove()).toBe(2);
    });

    it('should use custom compare function when provided', () => {
      const heap = new Heap<number>((a, b) => b - a); // maxHeap
      heap.insert(1);
      heap.insert(4);
      heap.insert(3);

      expect(heap.remove()).toBe(4);
      expect(heap.remove()).toBe(3);
      expect(heap.remove()).toBe(1);
    });

    it('should support object heap with keySelector and min mode', () => {
      const heap = new Heap(['min', (obj: {score: number}) => obj.score]);
      heap.insert({score: 30});
      heap.insert({score: 10});
      heap.insert({score: 20});

      expect(heap.remove()).toEqual({score: 10});
      expect(heap.remove()).toEqual({score: 20});
      expect(heap.remove()).toEqual({score: 30});
    });

    it('should support object heap with keySelector and max mode', () => {
      const heap = new Heap(['max', (obj: {score: number}) => obj.score]);
      heap.insert({score: 30});
      heap.insert({score: 10});
      heap.insert({score: 20});

      expect(heap.remove()).toEqual({score: 30});
      expect(heap.remove()).toEqual({score: 20});
      expect(heap.remove()).toEqual({score: 10});
    });
  });

  describe('empty', () => {
    it('should return true when heap is empty', () => {
      const heap = new Heap<number>();
      expect(heap.empty()).toBe(true);
    });

    it('should return false when heap is not empty', () => {
      const heap = new Heap<number>();
      heap.insert(3);

      expect(heap.empty()).toBe(false);
    });

    it('should return true with removing', () => {
      const heap = new Heap<number>();
      heap.insert(3);
      heap.remove();

      expect(heap.empty()).toBe(true);
    });
  });

  describe('peek', () => {
    it('should return -1 when heap is empty', () => {
      const heap = new Heap<number>();
      expect(heap.peek()).toBe(STATUS_CODE.NOT_FOUND);
    });

    it('should return the top value without removing it', () => {
      const heap = new Heap<number>();
      heap.insert(3);
      heap.insert(1);

      expect(heap.peek()).toBe(1);
      expect(heap.size()).toBe(2);
    });
  });

  describe('size', () => {
    it('should return 0 when heap is empty', () => {
      const heap = new Heap<number>();
      expect(heap.size()).toBe(0);
    });

    it('should correctly increase and decrease size on insert and remove', () => {
      const heap = new Heap<number>();

      expect(heap.size()).toBe(0);

      heap.insert(100);
      expect(heap.size()).toBe(1);

      heap.insert(200);
      expect(heap.size()).toBe(2);

      heap.remove();
      expect(heap.size()).toBe(1);

      heap.remove();
      expect(heap.size()).toBe(0);
    });
  });

  describe('insert', () => {
    it('should return 0 when insert successfully', () => {
      const heap = new Heap<number>();
      const toInsert = 10;

      expect(heap.insert(toInsert)).toBe(STATUS_CODE.SUCCESS);
      expect(heap.peek()).toBe(toInsert);
    });

    it('should insert objects based on keySelector in max heap', () => {
      const heap = new Heap(['max', (u: {score: number}) => u.score]);
      heap.insert({score: 40});
      heap.insert({score: 10});

      expect(heap.peek()).toEqual({score: 40});
    });

    it('should not reorder if object is mutated after insert', () => {
      type Item = {id: number; score: number};
      const heap = new Heap(['min', (item: Item) => item.score]);

      const a = {id: 1, score: 10};
      const b = {id: 2, score: 5};

      heap.insert(a);
      heap.insert(b);

      a.score = 0; // mutation

      expect(heap.remove()).toEqual(b);
    });

    it('should throw TypeError when inserting undefined', () => {
      const heap = new Heap<number>();
      expect(() => heap.insert(undefined as unknown as number)).toThrow(
        new TypeError('Unexpected Value Inserted: undefined'),
      );
    });

    it('should throw TypeError when inserting null', () => {
      const heap = new Heap<number>();
      expect(() => heap.insert(null as unknown as number)).toThrow(new TypeError('Unexpected Value Inserted: null'));
    });

    it('should throw TypeError when inserting NaN', () => {
      const heap = new Heap<number>();
      expect(() => heap.insert(NaN)).toThrow(new TypeError('Unexpected Value Inserted: NaN'));
    });
  });

  describe('remove', () => {
    it('should return 1 if heap is empty', () => {
      const heap = new Heap<number>();
      expect(heap.remove()).toBe(STATUS_CODE.FAIL);
    });

    it('should remove and return top value in minHeap', () => {
      const heap = new Heap<number>('min');
      heap.insert(30);
      heap.insert(10);
      heap.insert(20);

      expect(heap.remove()).toBe(10);
      expect(heap.remove()).toBe(20);
      expect(heap.remove()).toBe(30);
    });

    it('should remove and return top value in maxHeap', () => {
      const heap = new Heap<number>('max');
      heap.insert(30);
      heap.insert(10);
      heap.insert(20);

      expect(heap.remove()).toBe(30);
      expect(heap.remove()).toBe(20);
      expect(heap.remove()).toBe(10);
    });
  });
});
