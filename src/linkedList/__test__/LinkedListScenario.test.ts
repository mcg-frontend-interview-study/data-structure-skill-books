import {STATUS_CODE} from '../../constants/statusCode';
import {LinkedList, LinkedListNode} from '../LinkedList';

describe('LinkedListNode 단위 테스트', () => {
  test('LinkedListNode - 기본값 생성', () => {
    const node = new LinkedListNode<string>();
    expect(node.value).toBe(null);
    expect(node.next).toBe(null);
  });

  test('LinkedListNode - value만 제공하여 생성', () => {
    const node = new LinkedListNode<string>('test');
    expect(node.value).toBe('test');
    expect(node.next).toBe(null);
  });

  test('LinkedListNode - value와 next 모두 제공하여 생성', () => {
    const nextNode = new LinkedListNode<string>('next');
    const node = new LinkedListNode<string>('current', nextNode);
    expect(node.value).toBe('current');
    expect(node.next).toBe(nextNode);
  });
});

describe('LinkedList 기본 기능 테스트', () => {
  describe('빈 리스트 테스트', () => {
    let emptyList: LinkedList<string>;

    beforeEach(() => {
      emptyList = new LinkedList<string>();
    });

    test('빈 리스트에서 insert', () => {
      expect(emptyList.insert('1')).toBe(STATUS_CODE.SUCCESS);
      expect(emptyList.head?.value).toBe('1');
    });

    test('빈 리스트에서 delete', () => {
      expect(emptyList.delete()).toBe(STATUS_CODE.FAIL);
    });

    test('빈 리스트에서 deleteAt', () => {
      expect(emptyList.deleteAt(0)).toBe(STATUS_CODE.FAIL);
    });

    test('빈 리스트에서 deleteByValue', () => {
      expect(emptyList.deleteByValue('1')).toBe(STATUS_CODE.FAIL);
    });

    test('빈 리스트에서 printAll', () => {
      expect(emptyList.printAll()).toEqual([]);
    });

    test('빈 리스트에서 printAt', () => {
      expect(emptyList.printAt(0)).toBe(STATUS_CODE.NOT_FOUND);
    });

    test('빈 리스트에서 length', () => {
      expect(emptyList.length()).toBe(0);
    });

    test('빈 리스트에서 insertAt', () => {
      expect(emptyList.insertAt('1', 0)).toBe(STATUS_CODE.SUCCESS);
      expect(emptyList.head?.value).toBe('1');
    });
  });

  describe('단일 노드 테스트', () => {
    let singleNodeList: LinkedList<string>;

    beforeEach(() => {
      singleNodeList = new LinkedList<string>(new LinkedListNode<string>('only'));
    });

    test('단일 노드에서 delete', () => {
      expect(singleNodeList.delete()).toBe(STATUS_CODE.SUCCESS);
      expect(singleNodeList.head).toBe(null);
    });

    test('단일 노드에서 deleteAt(0)', () => {
      expect(singleNodeList.deleteAt(0)).toBe(STATUS_CODE.SUCCESS);
      expect(singleNodeList.head).toBe(null);
    });

    test('단일 노드에서 deleteByValue', () => {
      expect(singleNodeList.deleteByValue('only')).toBe(STATUS_CODE.SUCCESS);
      expect(singleNodeList.head).toBe(null);
    });
  });

  describe('헤드 노드 특수 케이스', () => {
    let linkedList: LinkedList<string>;

    beforeEach(() => {
      linkedList = new LinkedList<string>(new LinkedListNode<string>('1'));
    });

    test('deleteByValue - 헤드 노드 삭제', () => {
      linkedList.insert('2');
      linkedList.insert('3');
      const originalSecond = linkedList.head?.next;

      expect(linkedList.deleteByValue('1')).toBe(STATUS_CODE.SUCCESS);
      expect(linkedList.head).toBe(originalSecond);
    });

    test('insertAt index 0 - 기존 연결 유지', () => {
      linkedList.insert('2');
      const originalHead = linkedList.head;

      expect(linkedList.insertAt('newHead', 0)).toBe(STATUS_CODE.SUCCESS);
      expect(linkedList.head?.value).toBe('newHead');
      expect(linkedList.head?.next).toBe(originalHead);
    });

    test('deleteAt index 0 - 헤드 노드 삭제', () => {
      linkedList.insert('2');
      linkedList.insert('3');
      const originalSecond = linkedList.head?.next;

      expect(linkedList.deleteAt(0)).toBe(STATUS_CODE.SUCCESS);
      expect(linkedList.head).toBe(originalSecond);
    });
  });
});

describe('LinkedList 경계 케이스 및 에러 처리 테스트', () => {
  describe('잘못된 인덱스 및 값 처리', () => {
    let linkedList: LinkedList<string>;

    beforeEach(() => {
      linkedList = new LinkedList<string>();
    });

    test('insertAt - 헤드 교체 (index 0)', () => {
      const newHead = 'newHead';
      const originalNext = linkedList.head?.next ?? null;

      expect(linkedList.insertAt(newHead, 0)).toBe(STATUS_CODE.SUCCESS);
      expect(linkedList.head?.value).toBe(newHead);
      expect(linkedList.head?.next).toBe(originalNext);
    });

    test('insertAt - 잘못된 인덱스 (범위 초과)', () => {
      expect(linkedList.insertAt('fail', 10)).toBe(STATUS_CODE.FAIL);
    });

    test('insertAt - 음수 인덱스', () => {
      expect(linkedList.insertAt('fail', -1)).toBe(STATUS_CODE.FAIL);
    });

    test('deleteAt - 잘못된 인덱스 (범위 초과)', () => {
      expect(linkedList.deleteAt(10)).toBe(STATUS_CODE.FAIL);
    });

    test('deleteAt - 마지막 노드 삭제', () => {
      linkedList.insertAt('1', 0);
      linkedList.insert('2');

      expect(linkedList.deleteAt(1)).toBe(STATUS_CODE.SUCCESS);
      expect(linkedList.head?.value).toBe('1');
      expect(linkedList.head?.next).toBe(null);
    });

    test('deleteByValue - 존재하지 않는 값', () => {
      expect(linkedList.deleteByValue('nonexistent')).toBe(STATUS_CODE.FAIL);
    });

    test('printAt - 존재하지 않는 인덱스', () => {
      expect(linkedList.printAt(10)).toBe(STATUS_CODE.NOT_FOUND);
    });

    test('printAt - 음수 인덱스', () => {
      expect(linkedList.printAt(-1)).toBe(STATUS_CODE.NOT_FOUND);
    });

    test('insertAt - currentNode.next가 null인 경우', () => {
      const testList = new LinkedList<string>(new LinkedListNode<string>('first'));

      const result = testList.insertAt('test', 2);
      expect(result).toBe(STATUS_CODE.FAIL);
    });

    test('deleteAt - currentNode.next가 null인 경우', () => {
      const testList = new LinkedList<string>(new LinkedListNode<string>('first'));

      const result = testList.deleteAt(2);
      expect(result).toBe(STATUS_CODE.FAIL);
    });

    test('deleteAt - tempNextNode가 null인 경우', () => {
      const testList = new LinkedList<string>(new LinkedListNode<string>('first'));

      const result = testList.deleteAt(1);
      expect(result).toBe(STATUS_CODE.FAIL);
    });
  });

  describe('에러 처리 (catch 블록 커버리지)', () => {
    const testList = new LinkedList<string>();

    beforeEach(() => {
      Object.defineProperty(testList, 'head', {
        get: () => {
          throw new Error('Mock error');
        },
        set: () => {
          throw new Error('Mock error');
        },
        configurable: true,
      });
    });

    test('insert - 에러 발생 시 FAIL 반환', () => {
      const result = testList.insert('test');
      expect(result).toBe(STATUS_CODE.FAIL);
    });

    test('insertAt - 에러 발생 시 FAIL 반환', () => {
      const result = testList.insertAt('test', 0);
      expect(result).toBe(STATUS_CODE.FAIL);
    });

    test('delete - 에러 발생 시 FAIL 반환', () => {
      const result = testList.delete();
      expect(result).toBe(STATUS_CODE.FAIL);
    });

    test('deleteAt - 에러 발생 시 FAIL 반환', () => {
      const result = testList.deleteAt(0);
      expect(result).toBe(STATUS_CODE.FAIL);
    });

    test('printAt - 에러 발생 시 NOT_FOUND 반환  ', () => {
      const result = testList.printAt(0);
      expect(result).toBe(STATUS_CODE.NOT_FOUND);
    });

    test('deleteByValue - 에러 발생 시 FAIL 반환', () => {
      const result = testList.deleteByValue('test');
      expect(result).toBe(STATUS_CODE.FAIL);
    });
  });
});

describe('LinkedList 복합 시나리오 테스트', () => {
  let linkedList: LinkedList<string>;

  beforeEach(() => {
    linkedList = new LinkedList<string>();
  });

  test('연속적인 삽입과 삭제 작업', () => {
    expect(linkedList.length()).toBe(0);

    linkedList.insertAt('first', 0);
    linkedList.insert('second');
    linkedList.insert('third');
    linkedList.insertAt('middle', 1);

    expect(linkedList.printAll()).toEqual(['first', 'middle', 'second', 'third']);
    expect(linkedList.length()).toBe(4);

    linkedList.deleteAt(1);
    expect(linkedList.printAll()).toEqual(['first', 'second', 'third']);

    linkedList.deleteByValue('second');
    expect(linkedList.printAll()).toEqual(['first', 'third']);

    linkedList.delete();
    expect(linkedList.printAll()).toEqual(['first']);

    linkedList.deleteAt(0);
    expect(linkedList.length()).toBe(0);
  });

  test('대량 데이터 처리 시나리오', () => {
    for (let i = 0; i < 100; i++) {
      linkedList.insert(`node${i}`);
    }

    expect(linkedList.length()).toBe(100);
    expect(linkedList.printAt(50)).toBe('node50');
    expect(linkedList.printAt(99)).toBe('node99');

    linkedList.deleteByValue('node25');
    linkedList.deleteByValue('node50');
    linkedList.deleteByValue('node75');

    expect(linkedList.length()).toBe(97);
    expect(linkedList.printAt(25)).toBe('node26');
  });
});
