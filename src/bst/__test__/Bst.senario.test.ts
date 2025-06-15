import { BST } from "../Bst";
import { defaultNumberComparator } from "../utils/comparator";
import testCases from "./bst_delete_senarios.json";

describe("BinarySearchTree - _deleteByIteration (타입 안전성 강화 테스트)", () => {
    let tree: BST<number>;

    beforeEach(() => {
        // 매 테스트 케이스마다 새로운 트리 인스턴스 생성
        tree = new BST<number>(defaultNumberComparator);
    });

    test.each(testCases)(
        "시나리오: %s", // JSON의 name 필드를 테스트 이름으로 사용
        ({
            name,
            operations,
            deleteValue,
            expectedStatusCode,
            expectedInOrderTraversal,
            expectedSize,
            expectedRoot,
        }) => {
            // 초기 트리 상태 설정
            operations.forEach((op: { type: string; value: number }) => {
                if (op.type === "insert") {
                    tree.insertByIteration(op.value);
                }
            });

            // _deleteByIteration 메서드 호출
            // TestableBinarySearchTree 인터페이스 덕분에 타입 오류 없이 _deleteByIteration에 접근 가능
            const result = tree.deleteByIteration(deleteValue);

            // 예상 결과 검증
            expect(result).toBe(expectedStatusCode);
            expect(tree.getSize()).toBe(expectedSize);

            // 루트 노드 값 검증
            if (expectedRoot === null) {
                expect(tree.getRoot()).toBeNull();
            } else {
                expect(tree.getRoot()?.getValue()).toBe(expectedRoot);
            }

            // 중위 순회 결과 검증
            // inOrderTraversal() 메서드가 BinarySearchTree에 구현되어 있다고 가정
            const actualInOrderTraversal = tree.traverseInOrderByRecursion();
            expect(actualInOrderTraversal).toEqual(expectedInOrderTraversal);
        }
    );
});
