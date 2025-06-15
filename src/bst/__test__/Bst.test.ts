import { STATUS_CODE } from "../../constants/statusCode";
import { BST } from "../Bst";
import {
	Comparator,
	COMPARISON_RESULT,
	defaultNumberComparator,
	defaultStringComparator,
} from "../utils/comparator";

describe("BST", () => {
	type CustomObject = { id: number };
	const objectComparator: Comparator<CustomObject> = (a, b) =>
		a.id === b.id ? 0 : a.id > b.id ? 1 : -1;
	const TEST_SET = [
		{
			comparator: defaultNumberComparator,
			values: [5, 4, 3, 1, 6, 7, 2],
			exceptionValue: 324,
		},
		{
			comparator: defaultStringComparator,
			values: [
				"grape",
				"banana",
				"strawberry",
				"orange",
				"apple",
				"lemon",
				"pear",
			],
			exceptionValue: "pakxe",
		},
		{
			comparator: objectComparator,
			values: [
				{ id: 25 },
				{ id: 10 },
				{ id: 20 },
				{ id: 15 },
				{ id: 5 },
				{ id: 30 },
				{ id: 1 },
			],
			exceptionValue: { id: 324 },
		},
	];

	describe("insert", () => {
		describe("recursion", () => {
			it.each(TEST_SET)(
				"should sort %p correctly",
				({ comparator, values }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => bst.insertByRecursion(value));

					const inOrderResult = [...values].sort(comparator as any);

					expect(bst.getSize()).toBe(values.length);
					expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
				}
			);

			it.each(TEST_SET)(
				"should sort %p correctly if exist duplicated value",
				({ comparator, values }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => bst.insertByRecursion(value));
					bst.insertByRecursion(values[0]);

					const inOrderResult = [...values].sort(comparator as any);

					const BST_SIZE = values.length + 1;

					expect(bst.getSize()).toBe(BST_SIZE);
					expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
				}
			);
		});

		describe("iteration", () => {
			it.each(TEST_SET)(
				"should sort %p correctly",
				({ comparator, values }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => bst.insertByIteration(value));

					const inOrderResult = [...values].sort(comparator as any);

					expect(bst.getSize()).toBe(values.length);
					expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
				}
			);

			it.each(TEST_SET)(
				"should sort %p correctly if exist duplicated value",
				({ comparator, values }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => bst.insertByIteration(value));
					bst.insertByIteration(values[0]);

					const inOrderResult = [...values].sort(comparator as any);

					const BST_SIZE = values.length + 1;

					expect(bst.getSize()).toBe(BST_SIZE);
					expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
				}
			);
		});
	});

	describe("find", () => {
		describe("iteration", () => {
			it.each(TEST_SET)(
				"should find %p correctly",
				({ comparator, values }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => {
						bst.insertByIteration(value);
					});

					values.forEach((value) => {
						const foundResult = bst.findNodeByIteration(value);

						if (foundResult !== STATUS_CODE.NOT_FOUND) {
							const foundValue = foundResult.getValue();
							const comp = comparator as any;
							const compResult = comp(value, foundValue);

							expect(compResult).toBe(COMPARISON_RESULT.EQUAL);
						} else {
							throw new Error(
								`foundResult must not be ${STATUS_CODE.NOT_FOUND}.`
							);
						}
					});
				}
			);

			it.each(TEST_SET)(
				"should return not found status code when the value is not present in bst",
				({ comparator, values, exceptionValue }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => {
						bst.insertByIteration(value);
					});

					const findResult = bst.findNodeByIteration(exceptionValue);

					expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
				}
			);

			it("should return not found when bst is empty", () => {
				const bst = new BST(TEST_SET[0].comparator as any);

				const findResult = bst.findNodeByIteration(TEST_SET[0].values[0]);

				expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
			});
		});

		describe("recursion", () => {
			it.each(TEST_SET)(
				"should find %p correctly",
				({ comparator, values }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => {
						bst.insertByRecursion(value);
					});

					values.forEach((value) => {
						const findResult = bst.findNodeByRecursion(value);

						if (findResult !== STATUS_CODE.NOT_FOUND) {
							const foundValue = findResult.getValue();
							const comp = comparator as any;
							const compResult = comp(value, foundValue);

							expect(compResult).toBe(COMPARISON_RESULT.EQUAL);
						} else {
							console.log(value, findResult);
							throw new Error(
								`foundResult must not be ${STATUS_CODE.NOT_FOUND}.`
							);
						}
					});
				}
			);

			it.each(TEST_SET)(
				"should return not found status code when the value is not present in bst",
				({ comparator, values, exceptionValue }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => {
						bst.insertByRecursion(value);
					});

					const findResult = bst.findNodeByRecursion(exceptionValue);

					expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
				}
			);

			it("should return not found when bst is empty", () => {
				const bst = new BST(TEST_SET[0].comparator as any);

				const findResult = bst.findNodeByRecursion(TEST_SET[0].values[0]);

				expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
			});
		});
	});

	describe("delete", () => {
		describe("iterate", () => {
			let size = 0;

			it.each(TEST_SET)("should delete node", ({ comparator, values }) => {
				const bst = new BST(comparator as any);

				values.forEach((value) => {
					bst.insertByIteration(value);
					size += 1;
				});

				values.forEach((value) => {
					const deletionResult = bst.deleteByIteration(value);

					expect(deletionResult).toBe(STATUS_CODE.SUCCESS);

					size -= 1;
					expect(bst.getSize()).toBe(size);
				});
			});
		});
	});
});

describe("BST", () => {
	describe("insert", () => {
		type CustomObject = { id: number };
		const objectComparator: Comparator<CustomObject> = (a, b) =>
			a.id === b.id ? 0 : a.id > b.id ? 1 : -1;

		const TEST_SET = [
			{
				comparator: defaultNumberComparator,
				values: [1, 4, 3, 5, 6, 7, 2],
			},
			{
				comparator: defaultStringComparator,
				values: [
					"apple",
					"banana",
					"strawberry",
					"orange",
					"grape",
					"lemon",
					"pear",
				],
			},
			{
				comparator: objectComparator,
				values: [
					{ id: 10 },
					{ id: 20 },
					{ id: 15 },
					{ id: 5 },
					{ id: 25 },
					{ id: 30 },
					{ id: 1 },
				],
			},
		];

		describe("recursion", () => {
			it.each(TEST_SET)(
				"should sort %p correctly",
				({ comparator, values }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => bst.insertByRecursion(value));

					const inOrderResult = values.sort(comparator as any);

					expect(bst.getSize()).toBe(values.length);
					expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
				}
			);
		});

		describe("iteration", () => {
			it.each(TEST_SET)(
				"should sort %p correctly",
				({ comparator, values }) => {
					const bst = new BST(comparator as any);

					values.forEach((value) => bst.insertByIteration(value));

					const inOrderResult = values.sort(comparator as any);

					expect(bst.getSize()).toBe(values.length);
					expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
				}
			);
		});
	});
});
