export declare const STATUS_CODE: {
    readonly SUCCESS: 0;
    readonly NOT_FOUND: -1;
    readonly FAIL: 1;
};
export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];
export type ActionStatusCode = typeof STATUS_CODE.FAIL | typeof STATUS_CODE.SUCCESS;
export type ActionHasResultStatusCode<Result> = typeof STATUS_CODE.FAIL | Result;
export type FindStatusCode<FoundValue> = typeof STATUS_CODE.NOT_FOUND | FoundValue;
