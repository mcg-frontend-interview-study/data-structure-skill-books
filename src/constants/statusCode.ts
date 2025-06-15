// semantic return value. 이를 통해 사용자가 빠르고 직관적으로 결과를 알 수 있도록 함.
export const STATUS_CODE = {
    SUCCESS: 0,
    NOT_FOUND: -1,
    FAIL: 1,
} as const;

export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];

// 액션(ex delete) 메서드의 return type
export type ActionStatusCode = typeof STATUS_CODE.FAIL | typeof STATUS_CODE.SUCCESS;

export type ActionHasResultStatusCode<Result> = typeof STATUS_CODE.FAIL | Result;
// 탐색(ex find) 메서드의 return type
export type FindStatusCode<FoundValue> = typeof STATUS_CODE.NOT_FOUND | FoundValue;
