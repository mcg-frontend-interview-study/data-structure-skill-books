import { Comparator, COMPARISON_RESULT, defaultNumberComparator } from "../comparator/comparator";
import { NilNode, RedBlackTreeNode } from "./RedBlackTreeNode";

export class RedBlackTree<T> {
    private _root: RedBlackTreeNode<T> | null;

    private _comparator: Comparator<T>;

    constructor(comparator: Comparator<T>) {
        this._root = null;

        this._comparator = comparator;
    }

    getRoot() {
        return this._root;
    }

    insert(value: T) {
        const newNode = new RedBlackTreeNode<T>(value);
        const rootNode = this.getRoot();

        // 첫 추가
        if (rootNode == null) {
            newNode.color = "#000";

            this._root = newNode;
        } else {
            this._insertByIteration(rootNode, newNode);

            if (!newNode.parent) {
                throw new Error("insert할 때 newNode.parent를 지정해주세요.");
            }

            this._fixWhenInsert(rootNode, newNode.parent, newNode);
        }
    }

    private _insertByIteration(parentNode: RedBlackTreeNode<T>, newNode: RedBlackTreeNode<T>) {
        const comparisonResult = this._comparator(newNode.value, parentNode.value);

        switch (comparisonResult) {
            case COMPARISON_RESULT.EQUAL:
                throw new Error("중복되는 노드는 넣을 수 없습니다.");

            case COMPARISON_RESULT.GREATER_THAN:
                if (parentNode.right instanceof NilNode) {
                    // 비어 있는 경우
                    parentNode.right = newNode;
                    newNode.parent = parentNode;
                } else {
                    this._insertByIteration(parentNode.right, newNode);
                }
                break;

            case COMPARISON_RESULT.LESS_THAN:
                if (parentNode.left instanceof NilNode) {
                    // 비어 있는 경우
                    parentNode.left = newNode;
                    newNode.parent = parentNode;
                } else {
                    this._insertByIteration(parentNode.left, newNode);
                }
                break;
        }
    }

    private _fixWhenInsert(
        rootNode: RedBlackTreeNode<T>,
        parentNode: RedBlackTreeNode<T>,
        newNode: RedBlackTreeNode<T>
    ) {
        let childNode = newNode;
        // if (newNode.value === 21) {
        //     console.log(parentNode);
        // }
        // [ valid ] 부모 Black
        if (parentNode.color === "#000") {
            return;
        }

        while (parentNode.color === "#f00") {
            let grandParentNode = parentNode.parent;

            if (!grandParentNode) {
                // 현재 parentNode가 root라면 룰을 반드시 준수한다.
                break;
            }

            const uncleNode = grandParentNode.left === parentNode ? grandParentNode.right : grandParentNode.left;

            if (uncleNode instanceof NilNode || uncleNode.color === "#000") {
                // case 2에서는 rule이 반드시 지켜지므로 break 가능
                // [ case 2.1 ] 부모 형제 (x || Black) && 꺾임

                if (grandParentNode.left === parentNode && parentNode.right === childNode) {
                    // 그믐달 꺾임

                    this._RotateLeft({
                        childNode,
                        parentNode,
                        grandParentNode,
                    });

                    [childNode, parentNode] = [parentNode, childNode];
                } else if (grandParentNode.right === parentNode && parentNode.left === childNode) {
                    // 초승달 꺾임
                    this._RotateRight({
                        childNode,
                        parentNode,
                        grandParentNode,
                    });

                    [childNode, parentNode] = [parentNode, childNode];
                }

                // 꺾임 해결 후 반드시 직선이 된다.
                // [ case 2.2 ] 부모 형제 (x || Black) && 직선
                if (grandParentNode.left === parentNode && parentNode.left === childNode) {
                    // 왼쪽 직선
                    this._swapColor({ greatParentNode: grandParentNode, parentNode });

                    this._RotateRight({
                        childNode: parentNode,
                        parentNode: grandParentNode,
                        grandParentNode: grandParentNode.parent,
                    });

                    [parentNode, grandParentNode] = [grandParentNode, parentNode];
                } else if (grandParentNode.right === parentNode && parentNode.right === childNode) {
                    // 오른쪽 직선
                    this._swapColor({ greatParentNode: grandParentNode, parentNode });

                    this._RotateLeft({
                        childNode: parentNode,
                        parentNode: grandParentNode,
                        grandParentNode: grandParentNode.parent,
                    });
                    [parentNode, grandParentNode] = [grandParentNode, parentNode];
                }

                break;
            } else {
                // [ case 1 ] 부모 형제 Red <- 문제가 전파될 가능성이 있으므로 while
                // sol) switch

                this._switchColor({ parentNode: grandParentNode, leftNode: uncleNode, rightNode: parentNode });

                // 다음 턴 준비
                newNode = grandParentNode;

                if (!grandParentNode.parent) {
                    break;
                } else {
                    parentNode = grandParentNode.parent;
                }
            }
        }

        rootNode.color = "#000";
    }

    // 둘의 컬러만
    private _swapColor({
        parentNode,
        greatParentNode,
    }: {
        parentNode: RedBlackTreeNode<T>;
        greatParentNode: RedBlackTreeNode<T>;
    }) {
        parentNode.color = "#000";
        greatParentNode.color = "#f00";
    }

    // 세모 구조에서 자식들과 부모가 색 스위치
    private _switchColor({
        parentNode,
        leftNode,
        rightNode,
    }: {
        parentNode: RedBlackTreeNode<T>;
        leftNode: RedBlackTreeNode<T>;
        rightNode: RedBlackTreeNode<T>;
    }) {
        parentNode.color = "#f00";

        leftNode.color = "#000";
        rightNode.color = "#000";
    }
    private _RotateLeft({
        childNode,
        parentNode,
        grandParentNode,
    }: {
        childNode: RedBlackTreeNode<T>;
        parentNode: RedBlackTreeNode<T>;
        grandParentNode: RedBlackTreeNode<T> | null;
    }) {
        const isLeftParent = grandParentNode?.left === parentNode;

        const transplantationSubTree = childNode.left;
        parentNode.right = transplantationSubTree;
        transplantationSubTree.parent = parentNode;

        childNode.left = parentNode;
        parentNode.parent = childNode;

        if (grandParentNode) {
            childNode.parent = grandParentNode;
            if (isLeftParent) {
                grandParentNode.left = childNode;
            } else {
                grandParentNode.right = childNode;
            }
        } else {
            childNode.parent = null;
            this._root = childNode;
        }
    }

    private _RotateRight({
        childNode,
        parentNode,
        grandParentNode,
    }: {
        childNode: RedBlackTreeNode<T>;
        parentNode: RedBlackTreeNode<T>;
        grandParentNode: RedBlackTreeNode<T> | null;
    }) {
        const isLeftMiddle = grandParentNode?.left === parentNode;

        const transplantationSubTree = childNode.right;
        parentNode.left = transplantationSubTree;
        transplantationSubTree.parent = parentNode;

        childNode.right = parentNode;
        parentNode.parent = childNode;

        if (grandParentNode) {
            childNode.parent = grandParentNode;
            if (isLeftMiddle) {
                grandParentNode.left = childNode;
            } else {
                grandParentNode.right = childNode;
            }
        } else {
            childNode.parent = null;
            this._root = childNode;
        }
    }

    print() {
        if (this._root === null) {
            console.log("Tree is empty.");
            return;
        }
        this._printNode(this._root, "", true);
    }

    private _printNode(node: RedBlackTreeNode<T>, prefix: string, isTail: boolean) {
        const nodeColor = node.color === "#000" ? "⬛️" : "🟥";
        console.log(`${prefix}${isTail ? "└── " : "├── "}${node.value} (${nodeColor})`);

        const children: RedBlackTreeNode<T>[] = [];
        if (!(node.left instanceof NilNode)) {
            children.push(node.left);
        }
        if (!(node.right instanceof NilNode)) {
            children.push(node.right);
        }

        for (let i = 0; i < children.length; i++) {
            const newPrefix = prefix + (isTail ? "    " : "│   ");
            this._printNode(children[i], newPrefix, i === children.length - 1);
        }
    }
}

const a = new RedBlackTree<number>(defaultNumberComparator);

a.insert(14);
a.insert(7);
a.insert(17);
a.insert(12);
a.insert(4);
a.insert(3);
a.insert(5);

a.insert(15);
a.insert(22);
a.insert(19);
a.insert(24);

a.insert(2);
a.insert(21);
a.insert(20);

a.print();
