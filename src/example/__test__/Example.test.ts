import { STATUS_CODE } from "../../constants/statusCode";
import { Example } from "../Example";

describe("Example", () => {
    const NAME = "example";
    let example: Example;

    beforeEach(() => {
        example = new Example(NAME);
    });

    describe("name", () => {
        it("should get name", () => {
            expect(example.getName()).toBe(NAME);
        });
    });

    describe("size", () => {
        it("should set valid size", () => {
            const VALID_SIZE = 1;

            const statusCode = example.setSize(VALID_SIZE);

            expect(statusCode).toBe(STATUS_CODE.SUCCESS);
            expect(example.getSize()).toBe(VALID_SIZE);
        });

        it("should not set invalid size", () => {
            const INVALID_SIZE = -1;

            const statusCode = example.setSize(INVALID_SIZE);

            expect(statusCode).toBe(STATUS_CODE.FAIL);
        });
    });
});
