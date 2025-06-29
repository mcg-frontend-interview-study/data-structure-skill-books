import {STATUS_CODE} from '../../constants/statusCode';
import {BST} from '../Bst';
import {
  Comparator,
  COMPARISON_RESULT,
  defaultNumberComparator,
  defaultStringComparator,
} from '../../comparator/comparator';

describe('BST', () => {
  type CustomObject = {id: number};
  const objectComparator: Comparator<CustomObject> = (a, b) => (a.id === b.id ? 0 : a.id > b.id ? 1 : -1);
  const TEST_SET = [
    {
      comparator: defaultNumberComparator,
      values: [5, 4, 3, 1, 6, 7, 2],
      exceptionValue: 324,
    },
    {
      comparator: defaultStringComparator,
      values: ['grape', 'banana', 'strawberry', 'orange', 'apple', 'lemon', 'pear'],
      exceptionValue: 'pakxe',
    },
    {
      comparator: objectComparator,
      values: [{id: 25}, {id: 10}, {id: 20}, {id: 15}, {id: 5}, {id: 30}, {id: 1}],
      exceptionValue: {id: 324},
    },
  ];

  describe('insert', () => {
    describe('recursion', () => {
      it.each(TEST_SET)('should sort %p correctly', ({comparator, values}) => {
        const bst = new BST(comparator as any);

        values.forEach(value => bst.insertByRecursion(value));

        const inOrderResult = [...values].sort(comparator as any);

        expect(bst.getSize()).toBe(values.length);
        expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
      });

      it.each(TEST_SET)('should sort %p correctly if exist duplicated value', ({comparator, values}) => {
        const bst = new BST(comparator as any);

        values.forEach(value => bst.insertByRecursion(value));
        bst.insertByRecursion(values[0]);

        const inOrderResult = [...values].sort(comparator as any);

        const BST_SIZE = values.length + 1;

        expect(bst.getSize()).toBe(BST_SIZE);
        expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
      });
    });

    describe('iteration', () => {
      it.each(TEST_SET)('should sort %p correctly', ({comparator, values}) => {
        const bst = new BST(comparator as any);

        values.forEach(value => bst.insertByIteration(value));

        const inOrderResult = [...values].sort(comparator as any);

        expect(bst.getSize()).toBe(values.length);
        expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
      });

      it.each(TEST_SET)('should sort %p correctly if exist duplicated value', ({comparator, values}) => {
        const bst = new BST(comparator as any);

        values.forEach(value => bst.insertByIteration(value));
        bst.insertByIteration(values[0]);

        const inOrderResult = [...values].sort(comparator as any);

        const BST_SIZE = values.length + 1;

        expect(bst.getSize()).toBe(BST_SIZE);
        expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
      });
    });
  });

  describe('find', () => {
    describe('iteration', () => {
      it.each(TEST_SET)('should find %p correctly', ({comparator, values}) => {
        const bst = new BST(comparator as any);

        values.forEach(value => {
          bst.insertByIteration(value);
        });

        values.forEach(value => {
          const foundResult = bst.findNodeByIteration(value);

          if (foundResult !== STATUS_CODE.NOT_FOUND) {
            const foundValue = foundResult.getValue();
            const comp = comparator as any;
            const compResult = comp(value, foundValue);

            expect(compResult).toBe(COMPARISON_RESULT.EQUAL);
          } else {
            throw new Error(`foundResult must not be ${STATUS_CODE.NOT_FOUND}.`);
          }
        });
      });

      it.each(TEST_SET)('should find %p correctly', ({comparator, values}) => {
        const bst = new BST(comparator as any);

        values.forEach(value => {
          bst.insertByIteration(value);
        });

        values.forEach(value => {
          const foundResult = bst.find(value);

          if (foundResult !== STATUS_CODE.NOT_FOUND) {
            const foundValue = foundResult.getValue();
            const comp = comparator as any;
            const compResult = comp(value, foundValue);

            expect(compResult).toBe(COMPARISON_RESULT.EQUAL);
          } else {
            throw new Error(`foundResult must not be ${STATUS_CODE.NOT_FOUND}.`);
          }
        });
      });

      it.each(TEST_SET)('should find %p correctly', ({comparator, values}) => {
        const bst = new BST(comparator as any);

        values.forEach(value => {
          bst.insert(value);
        });

        values.forEach(value => {
          const foundResult = bst.findNodeByIteration(value);

          if (foundResult !== STATUS_CODE.NOT_FOUND) {
            const foundValue = foundResult.getValue();
            const comp = comparator as any;
            const compResult = comp(value, foundValue);

            expect(compResult).toBe(COMPARISON_RESULT.EQUAL);
          } else {
            throw new Error(`foundResult must not be ${STATUS_CODE.NOT_FOUND}.`);
          }
        });
      });

      it.each(TEST_SET)(
        'should return not found status code when the value is not present in bst',
        ({comparator, values, exceptionValue}) => {
          const bst = new BST(comparator as any);

          values.forEach(value => {
            bst.insertByIteration(value);
          });

          const findResult = bst.findNodeByIteration(exceptionValue);

          expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
        },
      );

      it('should return not found when bst is empty', () => {
        const bst = new BST(TEST_SET[0].comparator as any);

        const findResult = bst.findNodeByIteration(TEST_SET[0].values[0]);

        expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
      });
    });

    describe('recursion', () => {
      it.each(TEST_SET)('should find %p correctly', ({comparator, values}) => {
        const bst = new BST(comparator as any);

        values.forEach(value => {
          bst.insertByRecursion(value);
        });

        values.forEach(value => {
          const findResult = bst.findNodeByRecursion(value);

          if (findResult !== STATUS_CODE.NOT_FOUND) {
            const foundValue = findResult.getValue();
            const comp = comparator as any;
            const compResult = comp(value, foundValue);

            expect(compResult).toBe(COMPARISON_RESULT.EQUAL);
          } else {
            throw new Error(`foundResult must not be ${STATUS_CODE.NOT_FOUND}.`);
          }
        });
      });

      it.each(TEST_SET)(
        'should return not found status code when the value is not present in bst',
        ({comparator, values, exceptionValue}) => {
          const bst = new BST(comparator as any);

          values.forEach(value => {
            bst.insertByRecursion(value);
          });

          const findResult = bst.findNodeByRecursion(exceptionValue);

          expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
        },
      );

      it('should return not found when bst is empty', () => {
        const bst = new BST(TEST_SET[0].comparator as any);

        const findResult = bst.findNodeByRecursion(TEST_SET[0].values[0]);

        expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
      });
    });
  });

  describe('delete', () => {
    describe('iterate', () => {
      it.each(TEST_SET)('should delete node', ({comparator, values}) => {
        let size = 0;
        const bst = new BST(comparator as any);

        values.forEach(value => {
          bst.insertByIteration(value);
          size += 1;
        });

        values.forEach(value => {
          const deletionResult = bst.deleteByIteration(value);

          expect(deletionResult).toBe(STATUS_CODE.SUCCESS);

          size -= 1;

          expect(bst.getSize()).toBe(size);
        });
      });

      it.each(TEST_SET)('should delete node', ({comparator, values}) => {
        let size = 0;
        const bst = new BST(comparator as any);

        values.forEach(value => {
          bst.insertByIteration(value);
          size += 1;
        });

        values.forEach(value => {
          const deletionResult = bst.delete(value);

          expect(deletionResult).toBe(STATUS_CODE.SUCCESS);

          size -= 1;

          expect(bst.getSize()).toBe(size);
        });
      });
    });
  });
});

describe('BST Traversal Methods', () => {
  let bst: BST<number>;

  // 각 테스트 전에 새로운 BST를 초기화합니다.
  beforeEach(() => {
    bst = new BST<number>(defaultNumberComparator);
  });

  // 헬퍼 함수: 테스트를 위한 트리 구성
  const buildTestTree = () => {
    //         10
    //        /  \
    //       5    15
    //      / \     \
    //     3   7     18
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(3);
    bst.insert(7);
    bst.insert(18);
  };

  describe('traverseInOrderByRecursion', () => {
    test('should return an empty array for an empty tree', () => {
      expect(bst.traverseInOrderByRecursion()).toEqual([]);
    });

    test('should return elements in ascending order for a populated tree', () => {
      buildTestTree();
      expect(bst.traverseInOrderByRecursion()).toEqual([3, 5, 7, 10, 15, 18]);
    });

    test('should handle a tree with only a root node', () => {
      bst.insert(50);
      expect(bst.traverseInOrderByRecursion()).toEqual([50]);
    });

    test('should handle a left-skewed tree', () => {
      bst.insert(30);
      bst.insert(20);
      bst.insert(10);
      expect(bst.traverseInOrderByRecursion()).toEqual([10, 20, 30]);
    });

    test('should handle a right-skewed tree', () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(30);
      expect(bst.traverseInOrderByRecursion()).toEqual([10, 20, 30]);
    });
  });

  // Post-order 및 Pre-order 메서드의 오타가 수정되었다는 가정하에 테스트합니다.
  describe('traversePostOrderByRecursion', () => {
    test('should return an empty array for an empty tree', () => {
      expect(bst.traversePostOrderByRecursion()).toEqual([]);
    });

    test('should return elements in post-order for a populated tree (Left, Right, Root)', () => {
      buildTestTree();
      // Expected post-order: [3, 7, 5, 18, 15, 10]
      expect(bst.traversePostOrderByRecursion()).toEqual([3, 7, 5, 18, 15, 10]);
    });

    test('should handle a tree with only a root node', () => {
      bst.insert(50);
      expect(bst.traversePostOrderByRecursion()).toEqual([50]);
    });

    test('should handle a left-skewed tree', () => {
      bst.insert(30);
      bst.insert(20);
      bst.insert(10);
      expect(bst.traversePostOrderByRecursion()).toEqual([10, 20, 30]);
    });

    test('should handle a right-skewed tree', () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(30);
      expect(bst.traversePostOrderByRecursion()).toEqual([30, 20, 10]); // Adjusted for post-order
    });
  });

  describe('traversePreOrderByRecursion', () => {
    test('should return an empty array for an empty tree', () => {
      expect(bst.traversePreOrderByRecursion()).toEqual([]);
    });

    test('should return elements in pre-order for a populated tree (Root, Left, Right)', () => {
      buildTestTree();
      // Expected pre-order: [10, 5, 3, 7, 15, 18]
      expect(bst.traversePreOrderByRecursion()).toEqual([10, 5, 3, 7, 15, 18]);
    });

    test('should handle a tree with only a root node', () => {
      bst.insert(50);
      expect(bst.traversePreOrderByRecursion()).toEqual([50]);
    });

    test('should handle a left-skewed tree', () => {
      bst.insert(30);
      bst.insert(20);
      bst.insert(10);
      expect(bst.traversePreOrderByRecursion()).toEqual([30, 20, 10]);
    });

    test('should handle a right-skewed tree', () => {
      bst.insert(10);
      bst.insert(20);
      bst.insert(30);
      expect(bst.traversePreOrderByRecursion()).toEqual([10, 20, 30]);
    });
  });
});
