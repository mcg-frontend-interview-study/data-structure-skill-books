import { defaultNumberComparator } from "../../comparator/comparator";
import { RedBlackTree } from "../RedBlackTree";
import { RedBlackTreeNode, NilNode } from "../RedBlackTreeNode";
import redBlackTreeScenarios from "./redBlackTreeScenarios.json";

describe("RedBlackTree - Scenario Tests", () => {
    let tree: RedBlackTree<number>;

    beforeEach(() => {
        tree = new RedBlackTree<number>(defaultNumberComparator);
    });

    // 유틸리티 함수들
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
                return { isValid: true, blackHeight: 1 };
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

    // 연산 수행 함수
    function performOperation(tree: RedBlackTree<number>, op: any) {
        switch (op.type) {
            case "insert":
                tree.insert(op.value);
                break;
            case "delete":
                tree.delete(op.value);
                break;
            case "find":
                return tree.find(op.value);
            default:
                throw new Error(`Unknown operation type: ${op.type}`);
        }
    }

    // 어설션 검증 함수
    function checkAssertion(tree: RedBlackTree<number>, assertion: any) {
        const root = tree.getRoot();

        switch (assertion.type) {
            case "rootValue":
                if (root instanceof RedBlackTreeNode) {
                    expect(root.value).toBe(assertion.expected);
                } else {
                    expect(assertion.expected).toBeNull();
                }
                break;

            case "rootColor":
                if (assertion.expected === "black") {
                    expect(isBlack(root)).toBe(true);
                } else if (assertion.expected === "red") {
                    expect(isRed(root)).toBe(true);
                }
                break;

            case "redBlackValid":
                const validation = validateRedBlackProperties(root);
                if (!validation.isValid) {
                    console.error("Red-Black Tree validation errors:", validation.errors);
                }
                expect(validation.isValid).toBe(assertion.expected);
                break;

            case "traverseInOrder":
                const actualTraversal = getInOrderTraversal(root);
                expect(actualTraversal).toEqual(assertion.expected);
                break;

            case "maxBlackHeight":
                const heightValidation = validateRedBlackProperties(root);
                expect(heightValidation.blackHeight).toBeLessThanOrEqual(assertion.expected);
                break;

            case "isEmpty":
                const isEmpty = root instanceof NilNode;
                expect(isEmpty).toBe(assertion.expected);
                break;

            case "find":
                const foundNode = tree.find(assertion.value);
                if (assertion.expected === "found") {
                    expect(foundNode).toBeInstanceOf(RedBlackTreeNode);
                } else if (assertion.expected === "not_found") {
                    expect(foundNode).toBeInstanceOf(NilNode);
                }
                break;

            default:
                throw new Error(`Unknown assertion type: ${assertion.type}`);
        }
    }

    // 시나리오 테스트 실행
    test.each(redBlackTreeScenarios)(`시나리오: $name`, (scenario: any) => {
        try {
            // 초기 연산 수행
            scenario.initialOperations.forEach((op: any) => {
                if (op.operation === "insert") {
                    tree.insert(op.value);
                } else if (op.operation === "delete") {
                    tree.delete(op.value);
                }
            });

            // 테스트 단계별 실행
            scenario.testSteps.forEach((step: any, stepIndex: number) => {
                if (step.operation) {
                    // 단일 연산
                    performOperation(tree, step.operation);
                } else if (step.operations) {
                    // 다중 연산
                    step.operations.forEach((op: any) => performOperation(tree, op));
                }

                // 어설션 검증
                step.assertions.forEach((assertion: any, assertionIndex: number) => {
                    try {
                        checkAssertion(tree, assertion);
                    } catch (error) {
                        console.error(`\n--- 실패한 어설션 정보 ---`);
                        console.error(`시나리오: ${scenario.name}`);
                        console.error(`스텝 인덱스: ${stepIndex}`);
                        console.error(`어설션 인덱스: ${assertionIndex}`);
                        console.error(`어설션 타입: ${assertion.type}`);
                        console.error(`예상값: ${JSON.stringify(assertion.expected)}`);
                        console.error(`현재 트리 상태:`);
                        tree.print();
                        console.error(`현재 중위 순회: [${getInOrderTraversal(tree.getRoot())}]`);
                        console.error(`Red-Black 검증:`, validateRedBlackProperties(tree.getRoot()));
                        console.error(`------------------------------`);
                        throw error;
                    }
                });
            });
        } catch (error) {
            console.error(`\n--- 시나리오 실행 실패 ---`);
            console.error(`시나리오 이름: ${scenario.name}`);
            console.error(`오류:`, error);
            console.error(`현재 트리 상태:`);
            tree.print();
            console.error(`------------------------------`);
            throw error;
        }
    });

    // 추가 스트레스 테스트
    describe("Stress Tests", () => {
        test("대용량 데이터 삽입/삭제 스트레스 테스트", () => {
            const values = Array.from({ length: 1000 }, (_, i) => Math.floor(Math.random() * 10000));

            // 삽입
            values.forEach((value) => tree.insert(value));

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            // 랜덤 삭제
            const toDelete = values.slice(0, 500);
            toDelete.forEach((value) => tree.delete(value));

            const afterDeleteValidation = validateRedBlackProperties(tree.getRoot());
            expect(afterDeleteValidation.isValid).toBe(true);
        });

        test("극단적 케이스 - 동일한 값 반복 삽입", () => {
            for (let i = 0; i < 100; i++) {
                tree.insert(42);
            }

            const root = tree.getRoot();
            expect(root).toBeInstanceOf(RedBlackTreeNode);
            expect((root as RedBlackTreeNode<number>).value).toBe(42);

            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            const traversal = getInOrderTraversal(root);
            expect(traversal).toEqual([42]);
        });

        test("빈 트리에서 삭제 연산", () => {
            tree.delete(100);

            const root = tree.getRoot();
            expect(root).toBeInstanceOf(NilNode);

            const traversal = getInOrderTraversal(root);
            expect(traversal).toEqual([]);
        });

        test("최악의 경우 시나리오 - 역순 삽입", () => {
            const values = Array.from({ length: 100 }, (_, i) => 100 - i);

            values.forEach((value) => tree.insert(value));

            const root = tree.getRoot();
            const validation = validateRedBlackProperties(root);
            expect(validation.isValid).toBe(true);

            // Black height가 적절한 범위에 있는지 확인
            const n = values.length;
            const maxExpectedBlackHeight = Math.ceil(Math.log2(n + 1)) * 2;
            expect(validation.blackHeight).toBeLessThanOrEqual(maxExpectedBlackHeight);

            const traversal = getInOrderTraversal(root);
            expect(traversal).toEqual([...values].sort((a, b) => a - b));
        });
    });
});
