/**
 * 실패하는 경우가 있는 메서드의 경우 실패: -1, 성공: 0
 * 에러를 던지지 않는 이유는 자료구조로 인해 프로그램이 중단되지 않도록 하기 위해
 *
 * "없다", "찾을 수 없다" 는 엄격히 다르다. 전자는 null, 후자는 -1
 */

import {
	ActionHasResultStatusCode,
	ActionStatusCode,
	FindStatusCode,
	STATUS_CODE,
	StatusCode,
} from "../constants/statusCode";
import { BSTNode } from "./BstNode";
import { Comparator, COMPARISON_RESULT } from "./utils/comparator";

// TODO: 생성자에 타입을 넣지 않으면 올바르게 사용하기 어려움
export class BST<T extends any> {
	private _root: BSTNode<T> | null;
	private _size: number;
	private _comparator: Comparator<T>;

	constructor(comparator: Comparator<T>) {
		this._root = null;
		this._size = 0;

		this._comparator = comparator;
	}

	private _getComparator() {
		return this._comparator;
	}

	insertByRecursion(value: T) {
		const parentNode = this.getRoot();

		if (parentNode === null) {
			this._insertFirst(value);
			return;
		} else {
			const newNode = new BSTNode(value);

			this._insertByRecursion(parentNode, newNode);
			this._addSize();
		}
	}

	private _insertByRecursion(parentNode: BSTNode<T>, newNode: BSTNode<T>) {
		const comparator = this._getComparator();
		const comparisonResult = comparator(
			newNode.getValue(),
			parentNode.getValue()
		);

		switch (comparisonResult) {
			case COMPARISON_RESULT.EQUAL:
				parentNode.addExistCount();
				break;

			case COMPARISON_RESULT.GREATER_THAN:
				const rightNode = parentNode.getRight();

				if (rightNode === null) {
					parentNode.setRight(newNode);
					newNode.setParent(parentNode);
				} else {
					this._insertByRecursion(rightNode, newNode);
				}
				break;

			case COMPARISON_RESULT.LESS_THAN:
				const leftNode = parentNode.getLeft();

				if (leftNode === null) {
					parentNode.setLeft(newNode);
					newNode.setParent(parentNode);
				} else {
					this._insertByRecursion(leftNode, newNode);
				}
				break;
		}
	}

	insertByIteration(value: T) {
		let rootNode = this.getRoot();

		if (rootNode === null) {
			this._insertFirst(value);
			return;
		} else {
			let parentNode: BSTNode<T> = rootNode;

			const newNode = new BSTNode(value);

			let stopFlag: boolean = false;

			while (!stopFlag) {
				const comparator = this._getComparator();
				const comparisonResult = comparator(value, parentNode.getValue());

				switch (comparisonResult) {
					case COMPARISON_RESULT.EQUAL:
						parentNode.addExistCount();
						stopFlag = true;
						break;

					case COMPARISON_RESULT.GREATER_THAN:
						const rightNode = parentNode.getRight();

						// 새 값이 더 큰 경우
						if (rightNode === null) {
							// 자식이 없는 경우
							parentNode.setRight(newNode);
							newNode.setParent(parentNode);
							stopFlag = true;

							break;
						} else {
							// 자식이 있는 경우
							parentNode = rightNode;
							break;
						}

					case COMPARISON_RESULT.LESS_THAN:
						const leftNode = parentNode.getLeft();

						// 새 값이 더 작은 경우
						if (leftNode === null) {
							parentNode.setLeft(newNode);
							newNode.setParent(parentNode);

							stopFlag = true;

							break;
						} else {
							parentNode = leftNode;
							break;
						}
				}
			}
			this._addSize();
		}
	}

	private _insertFirst(value: T) {
		const node = new BSTNode<T>(value);

		this._root = node;
		this._addSize();
	}

	findNodeByIteration(value: T): FindStatusCode<BSTNode<T>> {
		let rootNode = this.getRoot();

		if (rootNode === null) {
			return STATUS_CODE.NOT_FOUND;
		} else {
			let parentNode = rootNode;
			let parentValue = parentNode.getValue();

			const comparator = this._getComparator();

			while (true) {
				const comparisonResult = comparator(value, parentValue);

				switch (comparisonResult) {
					case COMPARISON_RESULT.EQUAL:
						return parentNode;

					case COMPARISON_RESULT.GREATER_THAN:
						const rightNode = parentNode.getRight();

						if (rightNode === null) {
							return STATUS_CODE.NOT_FOUND;
						} else {
							parentNode = rightNode;
							continue;
						}

					case COMPARISON_RESULT.LESS_THAN:
						const leftNode = parentNode.getLeft();

						if (leftNode === null) {
							return STATUS_CODE.NOT_FOUND;
						} else {
							parentNode = leftNode;
							continue;
						}
				}
			}
		}
	}

	findNodeByRecursion(value: T): FindStatusCode<BSTNode<T>> {
		const rootNode = this.getRoot();

		if (rootNode === null) {
			return STATUS_CODE.NOT_FOUND;
		}

		return this._findNodeByRecursion(rootNode, value);
	}

	private _findNodeByRecursion(
		parentNode: BSTNode<T>,
		value: T
	): FindStatusCode<BSTNode<T>> {
		const parentValue = parentNode.getValue();

		if (parentValue === value) {
			return parentNode;
		} else if (parentValue < value) {
			const rightNode = parentNode.getRight();
			if (rightNode === null) {
				return STATUS_CODE.NOT_FOUND;
			} else {
				return this._findNodeByRecursion(rightNode, value);
			}
		} else {
			const leftNode = parentNode.getLeft();
			if (leftNode === null) {
				return STATUS_CODE.NOT_FOUND;
			} else {
				return this._findNodeByRecursion(leftNode, value);
			}
		}
	}

	deleteByIteration(value: T): StatusCode {
		const statusCode = this._deleteByIteration(value);

		if (statusCode === 0) {
			this._subtractSize();
		}

		return statusCode;
	}

	private _deleteByIteration(value: T): StatusCode {
		const targetNode = this.findNodeByIteration(value);

		if (targetNode === -1) {
			return STATUS_CODE.FAIL;
		}

		const parentNode = targetNode.getParent();

		if (parentNode === null) {
			return STATUS_CODE.FAIL;
		}

		// 중복이 있는 경우
		if (targetNode.isNotSingle()) {
			targetNode.subtractExistCount();

			return STATUS_CODE.SUCCESS;
		}

		const leftNode = targetNode.getLeft();
		const rightNode = targetNode.getRight();

		if (leftNode !== null) {
			const largestValueNodeOfLeftSubTree =
				this.findLargestNodeByIteration(leftNode);

			try {
				if (largestValueNodeOfLeftSubTree === -1) {
					throw new Error(
						"설계 미스. 왼쪽 자식이 있는데, 왼쪽 서브트리의 largest값이 없는건 불가능."
					);
				}

				const parentNodeOfLargestValueNode =
					largestValueNodeOfLeftSubTree.getParent();

				if (parentNodeOfLargestValueNode === null) {
					throw new Error("설계 미스. 왼쪽 자식의 부모가 없는건 불가능.");
				}

				if (largestValueNodeOfLeftSubTree === leftNode) {
					// 이 자식이 직계 자식인 경우
					parentNode.setLeft(largestValueNodeOfLeftSubTree);
					largestValueNodeOfLeftSubTree.setParent(parentNode);
				} else {
					// 이 자식이 직계 자식이 아닌 경우

					parentNodeOfLargestValueNode.clearRight();
					parentNode.setLeft(largestValueNodeOfLeftSubTree);

					largestValueNodeOfLeftSubTree.setParent(parentNode);
					largestValueNodeOfLeftSubTree.setLeft(leftNode);
				}
				return STATUS_CODE.SUCCESS;
			} catch (e) {
				console.log(e);
				return STATUS_CODE.FAIL;
			}
		} else if (rightNode !== null) {
			const smallestValueNodeOfRightSubTree =
				this.findSmallestNodeByIteration(rightNode);

			try {
				if (smallestValueNodeOfRightSubTree === -1) {
					throw new Error(
						"설계 미스. 오른쪽 자식이 있는데, 오른쪽 서브트리의 smallest 없는건 불가능."
					);
				}

				const parentNodeOfSmallestValueNode =
					smallestValueNodeOfRightSubTree.getParent();

				if (parentNodeOfSmallestValueNode === null) {
					throw new Error("설계 미스. 오른쪽 자식의 부모가 없는건 불가능.");
				}

				if (smallestValueNodeOfRightSubTree === rightNode) {
					// 이 자식이 직계 자식인 경우

					parentNode.setRight(smallestValueNodeOfRightSubTree);
					smallestValueNodeOfRightSubTree.setParent(parentNode);
				} else {
					// 이 자식이 직계 자식이 아닌 경우

					parentNodeOfSmallestValueNode.clearLeft();
					parentNode.setRight(smallestValueNodeOfRightSubTree);

					smallestValueNodeOfRightSubTree.setParent(parentNode);
					smallestValueNodeOfRightSubTree.setRight(rightNode);
				}
				return STATUS_CODE.SUCCESS;
			} catch (e) {
				console.log(e);
				return STATUS_CODE.FAIL;
			}
		} else {
			parentNode.deleteChild(targetNode);

			return STATUS_CODE.SUCCESS;
		}
	}

	findLargestNodeByIteration(node: BSTNode<T>): FindStatusCode<BSTNode<T>> {
		if (node.isLeaf()) {
			return STATUS_CODE.NOT_FOUND;
		}

		let parentNode = node;

		while (true) {
			const rightNode = parentNode.getRight();

			if (rightNode === null) {
				return parentNode;
			} else {
				parentNode = rightNode;

				continue;
			}
		}
	}

	findSmallestNodeByIteration(node: BSTNode<T>): FindStatusCode<BSTNode<T>> {
		if (node.isLeaf()) {
			return STATUS_CODE.NOT_FOUND;
		}

		let parentNode = node;

		while (true) {
			const leftNode = parentNode.getLeft();

			if (leftNode === null) {
				return parentNode;
			} else {
				parentNode = leftNode;

				continue;
			}
		}
	}

	isEmpty() {
		return this._size === 0;
	}

	getSize() {
		return this._size;
	}

	private _addSize() {
		this._size += 1;
	}

	private _subtractSize(): ActionStatusCode {
		if (this.isEmpty()) {
			return STATUS_CODE.FAIL;
		}

		this._size -= 1;
		return STATUS_CODE.SUCCESS;
	}

	getRoot() {
		return this._root;
	}

	traverseInOrderByRecursion(): ActionHasResultStatusCode<T[]> {
		const rootNode = this.getRoot();

		if (rootNode === null) {
			return STATUS_CODE.FAIL;
		}

		const result = [];
		this._traverseInOrderByRecursion(rootNode, result);

		return result;
	}

	private _traverseInOrderByRecursion(parentNode: BSTNode<T>, result: T[]) {
		const leftNode = parentNode.getLeft();
		if (leftNode) {
			this._traverseInOrderByRecursion(leftNode, result);
		}

		result.push(parentNode.getValue());

		const rightNode = parentNode.getRight();
		if (rightNode) {
			this._traverseInOrderByRecursion(rightNode, result);
		}
	}

	traversePostOrderByRecursion(): ActionHasResultStatusCode<T[]> {
		const rootNode = this.getRoot();

		if (rootNode === null) {
			return STATUS_CODE.FAIL;
		}

		const result = [];
		this._traversePostOrderByRecursion(rootNode, result);

		return result;
	}

	private _traversePostOrderByRecursion(parentNode: BSTNode<T>, result: T[]) {
		result.push(parentNode.getValue());

		const leftNode = parentNode.getLeft();
		if (leftNode) {
			this._traverseInOrderByRecursion(leftNode, result);
		}

		const rightNode = parentNode.getRight();
		if (rightNode) {
			this._traverseInOrderByRecursion(rightNode, result);
		}
	}

	traversePreOrderByRecursion(): ActionHasResultStatusCode<T[]> {
		const rootNode = this.getRoot();

		if (rootNode === null) {
			return STATUS_CODE.FAIL;
		}

		const result = [];
		this._traversePreOrderByRecursion(rootNode, result);

		return result;
	}

	private _traversePreOrderByRecursion(parentNode: BSTNode<T>, result: T[]) {
		const leftNode = parentNode.getLeft();
		if (leftNode) {
			this._traverseInOrderByRecursion(leftNode, result);
		}

		const rightNode = parentNode.getRight();
		if (rightNode) {
			this._traverseInOrderByRecursion(rightNode, result);
		}

		result.push(parentNode.getValue());
	}

	printTreeByIteration(rootValue?: T): ActionStatusCode {
		let rootNode = rootValue
			? this.findNodeByIteration(rootValue)
			: this.getRoot();

		if (rootNode === null || rootNode === STATUS_CODE.NOT_FOUND) {
			return STATUS_CODE.FAIL;
		}

		/**
		 * right -> parent -> left순으로 반시계 회전한 모습을 출력한다.( 반시계 회전은 출력 용이를 위해..)
		 * 들여쓰기 깊이로 출력한다.
		 *
		 * traversePrint할 때 깊이를 넣는다. +1해서
		 * 그러면 print할 때 깊이값 * 공백 + ㄴ 같은걸 넣어서 숫자를 출력한다.
		 */

		const logs: string[] = [];

		this._traverseForPrint(rootNode, 0, "center", logs);
		console.log(logs.join("\n"));

		return STATUS_CODE.SUCCESS;
	}

	private _traverseForPrint(
		parentNode: BSTNode<T>,
		depth: number,
		direction: "center" | "left" | "right",
		logs: string[]
	) {
		const SPACE = "    ";

		const rightNode = parentNode.getRight();
		if (rightNode) {
			this._traverseForPrint(rightNode, depth + 1, "right", logs);
		}

		let directionString: string = "";
		switch (direction) {
			case "center":
				directionString = "";
				break;
			case "left":
				directionString = "↘";
				break;
			case "right":
				directionString = "↗";
				break;
		}

		let spaceString = SPACE.repeat(depth);

		let log = `${spaceString}${directionString} ${parentNode.getValue()}`;

		logs.push(log);

		const leftNode = parentNode.getLeft();
		if (leftNode) {
			this._traverseForPrint(leftNode, depth + 1, "left", logs);
		}
	}
}
