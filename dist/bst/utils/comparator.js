export const COMPARISON_RESULT = {
    EQUAL: 0,
    LESS_THAN: -1,
    GREATER_THAN: 1,
};
export const defaultNumberComparator = (a, b) => {
    if (a < b)
        return COMPARISON_RESULT.LESS_THAN;
    if (a > b)
        return COMPARISON_RESULT.GREATER_THAN;
    return COMPARISON_RESULT.EQUAL;
};
export const defaultStringComparator = (a, b) => {
    if (a < b)
        return COMPARISON_RESULT.LESS_THAN;
    if (a > b)
        return COMPARISON_RESULT.GREATER_THAN;
    return COMPARISON_RESULT.EQUAL;
};
