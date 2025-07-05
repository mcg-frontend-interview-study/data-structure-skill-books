import {BST} from '../Bst';
import {defaultNumberComparator} from '../../comparator/comparator';
import testCases from './bst_delete_test_cases.json';

describe('BinarySearchTree - _delete', () => {
  let tree: BST<number>;

  beforeEach(() => {
    tree = new BST<number>(defaultNumberComparator);
  });

  test.each(testCases)(
    '시나리오: %s',
    ({name, operations, deleteValue, expectedStatusCode, expectedInOrderTraversal, expectedSize, expectedRoot}) => {
      operations.forEach(({operation, value}) => {
        if (operation === 'insert') {
          tree.insertByIteration(value);
        }
      });

      const result = tree.deleteByIteration(deleteValue);

      const isResultCorrect = result === expectedStatusCode;
      const isSizeCorrect = tree.getSize() === expectedSize;
      const isRootCorrect =
        expectedRoot === null ? tree.getRoot() === null : tree.getRoot()?.getValue() === expectedRoot;
      const actualInOrderTraversal = tree.traverseInOrderByRecursion();
      const isInOrderCorrect = JSON.stringify(actualInOrderTraversal) === JSON.stringify(expectedInOrderTraversal);

      if (!isResultCorrect || !isSizeCorrect || !isRootCorrect || !isInOrderCorrect) {
        console.log(`\n--- 실패한 테스트 케이스 정보 ---`);
        console.log(`시나리오 이름: ${name}`);
        console.log(`삭제 값: ${deleteValue}`);
        console.log(`예상 상태 코드: ${expectedStatusCode}, 실제 상태 코드: ${result}`);
        console.log(`예상 사이즈: ${expectedSize}, 실제 사이즈: ${tree.getSize()}`);
        console.log(`예상 루트: ${expectedRoot}, 실제 루트: ${tree.getRoot()?.getValue()}`);
        tree.printTreeByIteration();
        console.log(`예상 중위 순회: [${expectedInOrderTraversal}], 실제 중위 순회: [${actualInOrderTraversal}]`);
        tree.printTreeByIteration();
        console.log(`------------------------------`);
      }

      expect(result).toBe(expectedStatusCode);
      expect(tree.getSize()).toBe(expectedSize);

      if (expectedRoot === null) {
        expect(tree.getRoot()).toBeNull();
      } else {
        expect(tree.getRoot()?.getValue()).toBe(expectedRoot);
      }

      expect(actualInOrderTraversal).toEqual(expectedInOrderTraversal);
    },
  );
});
