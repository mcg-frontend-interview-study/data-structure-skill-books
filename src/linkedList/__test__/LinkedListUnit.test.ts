import {STATUS_CODE} from '../../constants/statusCode';
import {LinkedList, LinkedListNode} from '../LinkedList';

describe('LinkedList-unit test', () => {
  let linkedList: LinkedList<string>;

  beforeEach(() => {
    linkedList = new LinkedList<string>(new LinkedListNode<string>('1'));
  });

  test('insert', () => {
    expect(linkedList.insert('2')).toBe(STATUS_CODE.SUCCESS);
    expect(linkedList.head?.value).toBe('1');
    expect(linkedList.head?.next?.value).toBe('2');
  });

  test('insertAt', () => {
    linkedList.insert('2');
    linkedList.insert('3');
    linkedList.insert('4');

    expect(linkedList.insertAt('5', 2)).toBe(STATUS_CODE.SUCCESS);
    expect(linkedList.head?.value).toBe('1');
    expect(linkedList.head?.next?.value).toBe('2');
    expect(linkedList.head?.next?.next?.value).toBe('5');
    expect(linkedList.head?.next?.next?.next?.value).toBe('3');
    expect(linkedList.head?.next?.next?.next?.next?.value).toBe('4');
  });

  test('delete', () => {
    linkedList.insert('2');
    linkedList.insert('3');
    linkedList.insert('4');

    expect(linkedList.delete()).toBe(STATUS_CODE.SUCCESS);
    expect(linkedList.head?.value).toBe('1');
    expect(linkedList.head?.next?.value).toBe('2');
    expect(linkedList.head?.next?.next?.value).toBe('3');
    expect(linkedList.head?.next?.next?.next?.value).toBe(undefined);
  });

  test('printAll', () => {
    linkedList.insert('2');
    linkedList.insert('3');
    linkedList.insert('4');

    expect(linkedList.printAll()).toEqual(['1', '2', '3', '4']);
  });

  test('printAt', () => {
    linkedList.insert('2');
    linkedList.insert('3');
    linkedList.insert('4');

    expect(linkedList.printAt(2)).toBe('3');
    expect(linkedList.printAt(3)).toBe('4');
    expect(linkedList.printAt(4)).toBe(STATUS_CODE.NOT_FOUND);
  });

  test('deleteAt', () => {
    linkedList.insert('2');
    linkedList.insert('3');
    linkedList.insert('4');

    expect(linkedList.deleteAt(2)).toBe(STATUS_CODE.SUCCESS);
    expect(linkedList.head?.value).toBe('1');
    expect(linkedList.head?.next?.value).toBe('2');
    expect(linkedList.head?.next?.next?.value).toBe('4');
  });

  test('deleteByValue', () => {
    linkedList.insert('2');
    linkedList.insert('3');
    linkedList.insert('4');

    expect(linkedList.deleteByValue('3')).toBe(STATUS_CODE.SUCCESS);
    expect(linkedList.head?.value).toBe('1');
    expect(linkedList.head?.next?.value).toBe('2');
    expect(linkedList.head?.next?.next?.value).toBe('4');
    expect(linkedList.head?.next?.next?.next?.value).toBe(undefined);
  });
});
