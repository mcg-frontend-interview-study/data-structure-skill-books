export declare const COMPARISON_RESULT: {
    readonly EQUAL: 0;
    readonly LESS_THAN: -1;
    readonly GREATER_THAN: 1;
};
export type ComparisonResult = (typeof COMPARISON_RESULT)[keyof typeof COMPARISON_RESULT];
export type Comparator<T> = {
    (a: T, b: T): ComparisonResult;
};
export declare const defaultNumberComparator: Comparator<number>;
export declare const defaultStringComparator: Comparator<string>;
