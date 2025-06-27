import { STATUS_CODE } from "../../constants/statusCode";
import { BSTNode } from "../BstNode";

describe("BstNode", () => {
    const initialValues = [324, "pakxe", false, { id: 324 }];

    describe("constructor", () => {
        it.each(initialValues)(
            `should initialize value(%p), existCount, and child/parent pointers correctly.`,
            (initialValue) => {
                const node = new BSTNode<typeof initialValue>(initialValue);

                expect(node.getValue()).toBe(initialValue);
                expect(node.isNotSingle()).toBe(false);
                expect(node.getParent()).toBeNull();
                expect(node.getLeft()).toBeNull();
                expect(node.getRight()).toBeNull();
            }
        );
    });

    describe("value", () => {
        const newValues = [324324, "pakxeeee", true, { id: 2222 }];
        const initialValueAndNewValues = initialValues.map((v, i) => ({
            initialValue: v,
            newValue: newValues[i],
        }));

        it.each(initialValueAndNewValues)("should set a new value(%p).", (value) => {
            const node = new BSTNode<typeof value.initialValue>(value.initialValue);

            node.setValue(value.newValue);

            expect(node.getValue()).toBe(value.newValue);
        });
    });

    describe("parent", () => {
        it(`should set and get a new parent.`, () => {
            const parentValue = "parent";
            const parentNode = new BSTNode(parentValue);

            const childValue = "child";
            const node = new BSTNode(childValue);

            node.setParent(parentNode);

            expect(node.getParent()).toBe(parentNode);
        });
    });

    describe("child", () => {
        describe("leaf", () => {
            it("should be a leaf node if it has no child", () => {
                const node = new BSTNode(1);

                expect(node.isLeaf()).toBe(true);
            });

            it("should not be a leaf node if it has left child", () => {
                const node = new BSTNode(1);
                const leftNode = new BSTNode(2);

                node.setLeft(leftNode);

                expect(node.isLeaf()).toBe(false);
            });

            it("should not be a leaf node if it has left child", () => {
                const node = new BSTNode(1);
                const rightNode = new BSTNode(2);

                node.setLeft(rightNode);

                expect(node.isLeaf()).toBe(false);
            });
        });

        const PARENT_VALUE = "parent";
        const CHILD_VALUE_LEFT = "left";
        const CHILD_VALUE_RIGHT = "right";

        // 자식 노드를 생성하는 헬퍼 함수
        const createChildNode = (value) => new BSTNode(value);

        // 각 테스트 그룹에서 공통적으로 사용할 변수 및 초기화 설정
        let parentNode;

        beforeEach(() => {
            parentNode = new BSTNode(PARENT_VALUE);
        });

        // ---
        describe("set operations", () => {
            it("should set a new left node", () => {
                const leftChildNode = createChildNode(CHILD_VALUE_LEFT);
                parentNode.setLeft(leftChildNode);
                expect(parentNode.getLeft()).toBe(leftChildNode);
            });

            it("should set a new right node", () => {
                const rightChildNode = createChildNode(CHILD_VALUE_RIGHT);
                parentNode.setRight(rightChildNode);
                expect(parentNode.getRight()).toBe(rightChildNode);
            });
        });

        // ---
        describe("get operations", () => {
            it("should get the left node when set", () => {
                const leftChildNode = createChildNode(CHILD_VALUE_LEFT);
                parentNode.setLeft(leftChildNode);
                expect(parentNode.getLeft()).toBe(leftChildNode);
            });

            it("should get the right node when set", () => {
                const rightChildNode = createChildNode(CHILD_VALUE_RIGHT);
                parentNode.setRight(rightChildNode);
                expect(parentNode.getRight()).toBe(rightChildNode);
            });

            it("should return null for getLeft if no left node is set", () => {
                expect(parentNode.getLeft()).toBeNull();
            });

            it("should return null for getRight if no right node is set", () => {
                expect(parentNode.getRight()).toBeNull();
            });
        });

        // ---
        describe("clear operations", () => {
            it("should clear the left node", () => {
                const leftChildNode = createChildNode(CHILD_VALUE_LEFT);
                parentNode.setLeft(leftChildNode);
                parentNode.clearLeft();
                expect(parentNode.getLeft()).toBeNull(); // isLeftEmpty() 대신 getLeft()가 null인지 확인
            });

            it("should clear the right node", () => {
                const rightChildNode = createChildNode(CHILD_VALUE_RIGHT);
                parentNode.setRight(rightChildNode);
                parentNode.clearRight();
                expect(parentNode.getRight()).toBeNull(); // isRightEmpty() 대신 getRight()가 null인지 확인
            });
        });

        describe("delete", () => {
            let node: BSTNode<number>;

            beforeEach(() => {
                // 매번 새로운 인스턴스 사용.
                node = new BSTNode(1);
            });

            describe("left", () => {
                it("should clear left node(target node)", () => {
                    const leftNode = new BSTNode(2);

                    node.setLeft(leftNode);
                    const statusCode = node.deleteChild(leftNode);

                    expect(statusCode).toBe(STATUS_CODE.SUCCESS);
                });
            });

            describe("right", () => {
                it("should clear right node(target node)", () => {
                    const rightNode = new BSTNode(2);

                    node.setRight(rightNode);
                    const statusCode = node.deleteChild(rightNode);

                    expect(statusCode).toBe(STATUS_CODE.SUCCESS);
                });
            });

            it("should fail to clear if a node is empty", () => {
                const childNode = new BSTNode(2);

                const statusCode = node.deleteChild(childNode);

                expect(statusCode).toBe(STATUS_CODE.FAIL);
            });
        });
    });

    describe("exist count", () => {
        it("should be single if only one exists.", () => {
            const node = new BSTNode(1);

            expect(node.isNotSingle()).toBe(false);
        });

        describe("add exist count", () => {
            it("should not be single if over than one exists", () => {
                const node = new BSTNode(1);

                node.addExistCount();

                expect(node.isNotSingle()).toBe(true);
            });
        });

        describe("subtract exist count", () => {
            it("should not subtract if only one exists.", () => {
                const node = new BSTNode(1);

                const statusCode = node.subtractExistCount();

                expect(statusCode).toBe(STATUS_CODE.FAIL);
            });

            it("should subtract if over than one exists.", () => {
                const node = new BSTNode(1);

                node.addExistCount();
                const statusCode = node.subtractExistCount();

                expect(statusCode).toBe(STATUS_CODE.SUCCESS);
            });
        });

    });
});
