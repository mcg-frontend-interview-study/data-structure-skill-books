export const COMPARISON_RESULT = {
	EQUAL: 0,
	LESS_THAN: -1,
	GREATER_THAN: 1,
} as const;

export type ComparisonResult =
	(typeof COMPARISON_RESULT)[keyof typeof COMPARISON_RESULT];

export type Comparator<T> = {
	(a: T, b: T): ComparisonResult;
};

export const defaultNumberComparator: Comparator<number> = (
	a,
	b
): ComparisonResult => {
	if (a < b) return COMPARISON_RESULT.LESS_THAN;
	if (a > b) return COMPARISON_RESULT.GREATER_THAN;

	return COMPARISON_RESULT.EQUAL;
};

export const defaultStringComparator: Comparator<string> = (
	a,
	b
): ComparisonResult => {
	if (a < b) return COMPARISON_RESULT.LESS_THAN;
	if (a > b) return COMPARISON_RESULT.GREATER_THAN;

	return COMPARISON_RESULT.EQUAL;
};
