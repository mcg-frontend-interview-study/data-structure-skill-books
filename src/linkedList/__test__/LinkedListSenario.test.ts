import {LinkedList, LinkedListNode} from '../LinkedList';

describe('LinkedList-senario test', () => {
  test('insert', () => {
    const linkedList = new LinkedList<string>(new LinkedListNode<string>('1'));
    linkedList.insert('2');
    expect(linkedList.head?.value).toBe('1');
    expect(linkedList.head?.next?.value).toBe('2');
  });
});
