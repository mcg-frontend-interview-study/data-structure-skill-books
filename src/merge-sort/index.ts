type Comparator<T> = (a: T, b: T) => number;

const defaultComparator: Comparator<any> = (a, b) => {
  const aStr = String(a);
  const bStr = String(b);
  if (aStr < bStr) return -1;
  if (aStr > bStr) return 1;
  return 0;
};

const merge = <T>(left: T[], right: T[], comparator: Comparator<T>): T[] => {
  const result: T[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (comparator(left[i], right[j]) <= 0) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
};

const mergeSortRecursive = <T>(arr: T[], comparator: Comparator<T>): T[] => {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  const sortedLeft = mergeSortRecursive(left, comparator);
  const sortedRight = mergeSortRecursive(right, comparator);

  return merge(sortedLeft, sortedRight, comparator);
};

export const mergeSort = <T>(array: T[], comparator: Comparator<T> = defaultComparator): T[] => {
  if (!array || array.length <= 1) {
    return array;
  }

  const sortedArray = mergeSortRecursive([...array], comparator);

  array.length = 0;
  array.push(...sortedArray);
  return array;
};
