import { defaultNumberComparator } from "../../comparator/comparator";
import { RedBlackTree } from "../RedBlackTree";
import { RedBlackTreeNode, NilNode } from "../RedBlackTreeNode";

describe("RedBlackTree", () => {
    let tree: RedBlackTree<number>;

    beforeEach(() => {
        tree = new RedBlackTree<number>(defaultNumberComparator);
    });

    // Red-Black Tree 속성 검증 유틸리티 함수들
    const isRed = (node: any): boolean => {
        return node instanceof RedBlackTreeNode && node.color === "#f00";
    };

    const isBlack = (node: any): boolean => {
        return node instanceof NilNode || (node instanceof RedBlackTreeNode && node.color === "#000");
    };

    const validateRedBlackProperties = (root: any): { isValid: boolean; blackHeight: number; errors: string[] } => {
        const errors: string[] = [];

        if (!root || root instanceof NilNode) {
            return { isValid: true, blackHeight: 1, errors: [] };
        }

        // 속성 1: 루트는 검은색이어야 함
        if (isRed(root)) {
            errors.push("Root node must be black");
        }

        // 재귀적으로 검증
        const validateNode = (node: any): { isValid: boolean; blackHeight: number } => {
            if (!node || node instanceof NilNode) {
                return { isValid: true, blackHeight: 1 }; // NIL 노드는 검은색으로 간주
            }

            const leftResult = validateNode(node.left);
            const rightResult = validateNode(node.right);

            // 속성 4: 빨간 노드의 자식은 모두 검은색이어야 함
            if (isRed(node)) {
                if (isRed(node.left) || isRed(node.right)) {
                    errors.push(`Red node ${node.value} has red child`);
                    return { isValid: false, blackHeight: 0 };
                }
            }

            // 속성 5: 모든 경로에서 검은 노드 개수가 동일해야 함
            if (leftResult.blackHeight !== rightResult.blackHeight) {
                errors.push(
                    `Black height mismatch at node ${node.value}: left=${leftResult.blackHeight}, right=${rightResult.blackHeight}`
                );
                return { isValid: false, blackHeight: 0 };
            }

            const currentBlackHeight = leftResult.blackHeight + (isBlack(node) ? 1 : 0);

            return {
                isValid: leftResult.isValid && rightResult.isValid,
                blackHeight: currentBlackHeight,
            };
        };

        const result = validateNode(root);
        return {
            isValid: result.isValid && errors.length === 0,
            blackHeight: result.blackHeight,
            errors,
        };
    };

    const getInOrderTraversal = (root: any): number[] => {
        if (!root || root instanceof NilNode) {
            return [];
        }

        const result: number[] = [];
        const traverse = (node: any) => {
            if (!node || node instanceof NilNode) return;
            traverse(node.left);
            result.push(node.value);
            traverse(node.right);
        };

        traverse(root);
        return result;
    };

    describe("Insert Operations", () => {
        test("빈 트리에 삽입 - 루트는 검은색이어야 함", () => {
            tree.insert(10);

            const root = tree.getRoot();
            expect(root).toBeInstanceOf(RedBlackTreeNode);
            expect((root as RedBlackTreeNode<number>).value).toBe(10);
            expect(isBlack(root)).toBe(true);

            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);
        });

        test("두 번째 노드 삽입 - Red-Black 속성 유지", () => {
            tree.insert(10);
            tree.insert(5);

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10]);
        });

        test("Red-Red violation 해결 - Uncle이 빨간색인 경우 (Recoloring)", () => {
            // 이 순서로 삽입하면 recoloring이 발생
            tree.insert(10);
            tree.insert(5);
            tree.insert(15);
            tree.insert(3); // 이 삽입에서 recoloring 발생

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([3, 5, 10, 15]);
        });

        test("Red-Red violation 해결 - Left-Left case (Right rotation)", () => {
            tree.insert(30);
            tree.insert(20);
            tree.insert(40);
            tree.insert(10);
            tree.insert(25);
            tree.insert(5); // LL case 발생

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 20, 25, 30, 40]);
        });

        test("Red-Red violation 해결 - Left-Right case", () => {
            tree.insert(30);
            tree.insert(10);
            tree.insert(40);
            tree.insert(5);
            tree.insert(20);
            tree.insert(15); // LR case 발생

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 15, 20, 30, 40]);
        });

        test("Red-Red violation 해결 - Right-Right case (Left rotation)", () => {
            tree.insert(10);
            tree.insert(5);
            tree.insert(20);
            tree.insert(15);
            tree.insert(30);
            tree.insert(40); // RR case 발생

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 15, 20, 30, 40]);
        });

        test("Red-Red violation 해결 - Right-Left case", () => {
            tree.insert(10);
            tree.insert(5);
            tree.insert(30);
            tree.insert(25);
            tree.insert(40);
            tree.insert(20); // RL case 발생

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 20, 25, 30, 40]);
        });

        test("중복 값 삽입 방지", () => {
            tree.insert(10);
            tree.insert(5);
            tree.insert(15);
            tree.insert(10); // 중복 값

            const root = tree.getRoot();
            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 15]); // 중복되지 않음

            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);
        });

        test("연속 삽입으로 균형 유지 검증", () => {
            const values = [10, 5, 15, 3, 7, 12, 20, 1, 4, 6, 8, 11, 13, 17, 25];

            values.forEach((value) => tree.insert(value));

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([...values].sort((a, b) => a - b));
        });

        test("대용량 데이터 삽입 균형 검증", () => {
            const values = Array.from({ length: 100 }, (_, i) => i + 1);

            // 순서대로 삽입 (worst case for BST)
            values.forEach((value) => tree.insert(value));

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual(values);
        });
    });

    describe("Delete Operations", () => {
        test("존재하지 않는 노드 삭제", () => {
            tree.insert(10);
            tree.insert(5);
            tree.insert(15);

            // 존재하지 않는 값 삭제 시도
            tree.delete(20);

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 15]); // 변화 없음
        });

        test("빨간 노드 삭제 (단순 케이스)", () => {
            tree.insert(10);
            tree.insert(5);
            tree.insert(15);
            tree.insert(3);

            // 빨간 리프 노드 삭제
            tree.delete(3);

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 15]);
        });

        test("검은 노드 삭제 - 자식이 없는 경우", () => {
            tree.insert(10);
            tree.insert(5);
            tree.insert(15);
            tree.insert(12);
            tree.insert(18);

            // 검은 리프 노드 삭제 (Double Black 발생)
            tree.delete(5);

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([10, 12, 15, 18]);
        });

        test("검은 노드 삭제 - 자식이 하나인 경우", () => {
            tree.insert(20);
            tree.insert(10);
            tree.insert(30);
            tree.insert(5);
            tree.insert(15);
            tree.insert(25);
            tree.insert(35);
            tree.insert(1);

            // 자식이 하나인 검은 노드 삭제
            tree.delete(5);

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);

            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([1, 10, 15, 20, 25, 30, 35]);
        });

        test("검은 노드 삭제 - 자식이 둘인 경우 (Successor 사용)", () => {
            tree.insert(20);
            tree.insert(10);
            tree.insert(30);
            tree.insert(5);
            tree.insert(15);
            tree.insert(25);
            tree.insert(35);
            tree.insert(12);
            tree.insert(18);

            // 자식이 둘인 노드 삭제 (successor로 대체)
            tree.delete(15);

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 12, 18, 20, 25, 30, 35]);
        });

        test("루트 노드 삭제", () => {
            tree.insert(20);
            tree.insert(10);
            tree.insert(30);
            tree.insert(5);
            tree.insert(15);

            tree.delete(20); // 루트 삭제

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([5, 10, 15, 30]);

            // 새 루트는 검은색이어야 함
            expect(isBlack(root)).toBe(true);
        });

        test("복잡한 삭제 시나리오 - Double Black 해결", () => {
            const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
            values.forEach((value) => tree.insert(value));

            // 여러 노드 연속 삭제
            tree.delete(10);
            tree.delete(25);
            tree.delete(35);

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const expectedValues = values.filter((v) => ![10, 25, 35].includes(v)).sort((a, b) => a - b);
            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual(expectedValues);
        });

        test("모든 노드 삭제 후 빈 트리", () => {
            const values = [10, 5, 15, 3, 7, 12, 20];
            values.forEach((value) => tree.insert(value));

            // 모든 노드 삭제
            values.forEach((value) => tree.delete(value));

            const root = tree.getRoot();
            expect(root).toBeInstanceOf(NilNode);

            const inOrder = getInOrderTraversal(root);
            expect(inOrder).toEqual([]);
        });
    });

    describe("Find Operations", () => {
        beforeEach(() => {
            const values = [20, 10, 30, 5, 15, 25, 35];
            values.forEach((value) => tree.insert(value));
        });

        test("존재하는 값 찾기", () => {
            const foundNode = tree.find(15);
            expect(foundNode).toBeInstanceOf(RedBlackTreeNode);
            expect((foundNode as RedBlackTreeNode<number>).value).toBe(15);
        });

        test("존재하지 않는 값 찾기", () => {
            const foundNode = tree.find(100);
            expect(foundNode).toBeInstanceOf(NilNode);
        });

        test("빈 트리에서 찾기", () => {
            const emptyTree = new RedBlackTree<number>(defaultNumberComparator);
            const foundNode = emptyTree.find(10);
            expect(foundNode).toBeInstanceOf(NilNode);
        });
    });

    describe("Complex Scenarios", () => {
        test("Wikipedia 예제 시나리오", () => {
            // Wikipedia Red-Black Tree 예제 재현
            const operations = [
                { type: "insert", value: 13 },
                { type: "insert", value: 8 },
                { type: "insert", value: 17 },
                { type: "insert", value: 1 },
                { type: "insert", value: 11 },
                { type: "insert", value: 15 },
                { type: "insert", value: 25 },
                { type: "insert", value: 6 },
                { type: "insert", value: 22 },
                { type: "insert", value: 27 },
            ];

            operations.forEach((op) => {
                if (op.type === "insert") {
                    tree.insert(op.value);
                }
            });

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const expectedInOrder = operations.map((op) => op.value).sort((a, b) => a - b);
            const actualInOrder = getInOrderTraversal(root);
            expect(actualInOrder).toEqual(expectedInOrder);
        });

        test("극단적인 불균형 입력 처리", () => {
            // 오름차순 입력 (BST에서는 최악의 경우)
            const values = Array.from({ length: 50 }, (_, i) => i + 1);

            values.forEach((value) => tree.insert(value));

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            // Black height가 너무 크지 않은지 확인 (균형이 유지되는지)
            // Red-Black Tree의 Black height는 log(n+1) 이하여야 함
            const maxAllowedBlackHeight = Math.ceil(Math.log2(values.length + 1)) + 1;
            expect(validation.blackHeight).toBeLessThanOrEqual(maxAllowedBlackHeight);
        });

        test("삽입과 삭제가 혼합된 복잡한 시나리오", () => {
            const operations = [
                { type: "insert", values: [50, 30, 70, 20, 40, 60, 80] },
                { type: "delete", values: [20, 80] },
                { type: "insert", values: [10, 25, 35, 45, 55, 65, 75, 85] },
                { type: "delete", values: [30, 70] },
                { type: "insert", values: [5, 15, 32, 42, 52, 62, 72, 82] },
                { type: "delete", values: [10, 50] },
            ];

            const allInserted: number[] = [];
            const allDeleted: number[] = [];

            operations.forEach((op) => {
                if (op.type === "insert") {
                    op.values.forEach((value) => {
                        tree.insert(value);
                        allInserted.push(value);
                    });
                } else if (op.type === "delete") {
                    op.values.forEach((value) => {
                        tree.delete(value);
                        allDeleted.push(value);
                    });
                }

                // 각 단계마다 Red-Black 속성 검증
                const root = tree.getRoot();
                const validation = validateRedBlackProperties(root);
                expect(validation.isValid).toBe(true);
            });

            const expectedValues = allInserted.filter((v) => !allDeleted.includes(v)).sort((a, b) => a - b);
            const actualInOrder = getInOrderTraversal(tree.getRoot());
            expect(actualInOrder).toEqual(expectedValues);
        });
    });
});
