import { BST } from "../Bst";
import { Comparator, defaultNumberComparator, defaultStringComparator } from "../utils/comparator";

describe("BST", () => {
    describe("insert", () => {
        type CustomObject = { id: number };
        const objectComparator: Comparator<CustomObject> = (a, b) => (a.id === b.id ? 0 : a.id > b.id ? 1 : -1);

        const TEST_SET = [
            {
                comparator: defaultNumberComparator,
                values: [1, 4, 3, 5, 6, 7, 2],
            },
            {
                comparator: defaultStringComparator,
                values: ["apple", "banana", "strawberry", "orange", "grape", "lemon", "pear"],
            },
            {
                comparator: objectComparator,
                values: [{ id: 10 }, { id: 20 }, { id: 15 }, { id: 5 }, { id: 25 }, { id: 30 }, { id: 1 }],
            },
        ];

        describe("recursion", () => {
            it.each(TEST_SET)("should sort %p correctly", ({ comparator, values }) => {
                const bst = new BST(comparator as any);

                values.forEach((value) => bst.insertByRecursion(value));

                const inOrderResult = values.sort(comparator as any);

                expect(bst.getSize()).toBe(values.length);
                expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
            });
        });

        describe("iteration", () => {
            it.each(TEST_SET)("should sort %p correctly", ({ comparator, values }) => {
                const bst = new BST(comparator as any);

                values.forEach((value) => bst.insertByIteration(value));

                const inOrderResult = values.sort(comparator as any);

                expect(bst.getSize()).toBe(values.length);
                expect(bst.traverseInOrderByRecursion()).toStrictEqual(inOrderResult);
            });
        });
    });
});
