export type Comparator<T> = {
    (a: T, b: T): -1 | 0 | 1;
};

export const defaultNumberComparator: Comparator<number> = (a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
};

export const defaultStringComparator: Comparator<string> = (a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
};
