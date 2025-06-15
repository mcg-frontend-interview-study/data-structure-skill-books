import { STATUS_CODE } from "../../constants/statusCode";
import { BST } from "../Bst";
import { defaultNumberComparator } from "../utils/comparator";
import bstScenarios from "./bst_senario_test_cases.json";

describe("BST-senario test", () => {
    let bst: BST<number>;

    beforeEach(() => {
        bst = new BST<number>(defaultNumberComparator);
    });

    test.each(bstScenarios)(`시나리오: $name`, (scenario) => {
        scenario.initialOperations.forEach((op) => {
            if (op.operation === "insert") {
                bst.insert(op.value);
            }
        });

        scenario.testSteps.forEach((step) => {
            if (step.operation) {
                performOperation(bst, step.operation);
            } else if (step.operations) {
                step.operations.forEach((op) => performOperation(bst, op));
            }

            step.assertions.forEach((assertion) => {
                checkAssertion(bst, assertion);
            });
        });
    });
});

function performOperation(bst: BST<number>, op: any) {
    switch (op.type) {
        case "insert":
            bst.insert(op.value);
            break;
        case "delete":
            bst.delete(op.value);
            break;
        case "find":
            bst.find(op.value);
            break;
    }
}

function checkAssertion(bst: BST<number>, assertion: any) {
    switch (assertion.type) {
        case "size":
            expect(bst.getSize()).toBe(assertion.expected);
            break;
        case "rootValue":
            const rootValue = bst.getRoot()?.getValue() ?? null;
            expect(rootValue).toBe(assertion.expected);
            break;
        case "traverseInOrder":
            const actualInOrder = bst.traverseInOrderByRecursion();
            expect(actualInOrder).toEqual(assertion.expected);
            break;
        case "statusCode":
            if (assertion.value !== undefined) {
                let result;
                if (assertion.operationType === "delete") {
                    result = bst.delete(assertion.value);
                } else {
                    result = bst.find(assertion.value);
                }
                const actualStatusCode =
                    result !== STATUS_CODE.NOT_FOUND && result !== STATUS_CODE.FAIL ? STATUS_CODE.SUCCESS : result;
                expect(actualStatusCode).toBe(assertion.expected === "node" ? STATUS_CODE.SUCCESS : assertion.expected);
            }
            break;
        case "nodeValue":
            const foundNode = bst.find(assertion.value as number);
            expect(foundNode).not.toBe(STATUS_CODE.NOT_FOUND);
            expect((foundNode as any).getValue()).toBe(assertion.expected);
            break;
        case "existCount":
            const nodeWithExistCount = bst.find(assertion.value as number);
            expect(nodeWithExistCount).not.toBe(STATUS_CODE.NOT_FOUND);
            expect((nodeWithExistCount as any).getExistCount()).toBe(assertion.expected);
            break;
        case "find":
            const findResult = bst.find(assertion.value as number);
            if (assertion.expected === "node") {
                expect(findResult).not.toBe(STATUS_CODE.NOT_FOUND);
            } else if (assertion.expected === STATUS_CODE.NOT_FOUND) {
                expect(findResult).toBe(STATUS_CODE.NOT_FOUND);
            }
            break;
    }
}
