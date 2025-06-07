import { ActionStatusCode, STATUS_CODE } from "../constants/statusCode";

export class Example {
    private name: string;
    private size: number;

    constructor(name: string) {
        this.name = name;
        this.size = 0;
    }

    public setSize(size: number): ActionStatusCode {
        if (size < 0) {
            return STATUS_CODE.FAIL;
        }

        this.size = size;
        return STATUS_CODE.SUCCESS;
    }

    public getSize() {
        return this.size;
    }

    public getName() {
        return this.name;
    }
}
