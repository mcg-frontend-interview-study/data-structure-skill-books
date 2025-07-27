import {STATUS_CODE} from '../../constants/statusCode';
import {Queue} from '../Queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  describe('add', () => {
    test('should add a single element to an empty queue', () => {
      queue.add(10);
      expect(queue.getSize()).toBe(1);
      // @ts-ignore
      expect(queue._head?.value).toBe(10);
      // @ts-ignore
      expect(queue._tail?.value).toBe(10);
    });

    test('should add multiple elements to the end of the queue', () => {
      queue.add(10);
      queue.add(20);
      queue.add(30);
      expect(queue.getSize()).toBe(3);
      // @ts-ignore
      expect(queue._head?.value).toBe(10);
      // @ts-ignore
      expect(queue._tail?.value).toBe(30);
      expect(queue.popFront()).toBe(10);
      expect(queue.getSize()).toBe(2);
    });
  });

  describe('addFront', () => {
    test('should add a single element to an empty queue using addFront', () => {
      queue.addFront(100);
      expect(queue.getSize()).toBe(1);
      // @ts-ignore
      expect(queue._head?.value).toBe(100);
      // @ts-ignore
      expect(queue._tail?.value).toBe(100);
    });

    test('should add multiple elements to the front of the queue', () => {
      queue.add(10);
      queue.addFront(20);
      queue.addFront(30);
      expect(queue.getSize()).toBe(3);
      // @ts-ignore
      expect(queue._head?.value).toBe(30);
      // @ts-ignore
      expect(queue._tail?.value).toBe(10);
      expect(queue.popFront()).toBe(30);
      expect(queue.getSize()).toBe(2);
    });
  });

  describe('pop', () => {
    test('should return FAIL when popping from an empty queue', () => {
      expect(queue.pop()).toBe(STATUS_CODE.FAIL);
      expect(queue.getSize()).toBe(0);
    });

    test('should correctly pop the only element from a queue with one element', () => {
      queue.add(50);
      expect(queue.pop()).toBe(50);
      expect(queue.getSize()).toBe(0);
    });

    test('should correctly pop elements from the back of the queue', () => {
      queue.add(10);
      queue.add(20);
      queue.add(30);
      expect(queue.getSize()).toBe(3);

      expect(queue.pop()).toBe(30);
      expect(queue.getSize()).toBe(2);

      expect(queue.pop()).toBe(20);
      expect(queue.getSize()).toBe(1);

      expect(queue.pop()).toBe(10);
      expect(queue.getSize()).toBe(0);
    });
  });

  describe('popFront', () => {
    test('should return FAIL when popFronting from an empty queue', () => {
      expect(queue.popFront()).toBe(STATUS_CODE.FAIL);
      expect(queue.getSize()).toBe(0);
    });

    test('should correctly popFront the only element from a queue with one element', () => {
      queue.add(70);
      expect(queue.popFront()).toBe(70);
      expect(queue.getSize()).toBe(0);
    });

    test('should correctly popFront elements from the front of the queue (FIFO)', () => {
      queue.add(100);
      queue.add(200);
      queue.add(300);
      expect(queue.getSize()).toBe(3);

      expect(queue.popFront()).toBe(100);
      expect(queue.getSize()).toBe(2);

      expect(queue.popFront()).toBe(200);
      expect(queue.getSize()).toBe(1);

      expect(queue.popFront()).toBe(300);
      expect(queue.getSize()).toBe(0);
    });
  });

  describe('getSize', () => {
    test('should return 0 for an empty queue', () => {
      expect(queue.getSize()).toBe(0);
    });

    test('should return the correct size after adding elements', () => {
      queue.add(1);
      expect(queue.getSize()).toBe(1);
      queue.addFront(2);
      expect(queue.getSize()).toBe(2);
      queue.add(3);
      expect(queue.getSize()).toBe(3);
    });

    test('should return the correct size after removing elements', () => {
      queue.add(1);
      queue.add(2);
      queue.add(3);
      expect(queue.getSize()).toBe(3);
      queue.popFront();
      expect(queue.getSize()).toBe(2);
      queue.pop();
      expect(queue.getSize()).toBe(1);
      queue.popFront();
      expect(queue.getSize()).toBe(0);
    });
  });

  describe('isEmpty', () => {
    test('should return true for an empty queue', () => {
      expect(queue.isEmpty()).toBe(true);
    });

    test('should return false after adding elements', () => {
      queue.add(1);
      expect(queue.isEmpty()).toBe(false);
    });

    test('should return true after all elements are removed', () => {
      queue.add(1);
      queue.add(2);
      expect(queue.isEmpty()).toBe(false);
      queue.popFront();
      queue.pop();
      expect(queue.isEmpty()).toBe(true);
    });
  });
});
