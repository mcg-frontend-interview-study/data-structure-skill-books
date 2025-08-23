import {mergeSort} from './index';

describe('mergeSort 함수', () => {
  // 1. 정상 케이스
  describe('정상 케이스', () => {
    it('숫자 배열을 오름차순으로 정렬하고, 정렬된 배열을 반환해야 합니다', () => {
      const arr = [5, 2, 8, 1, 9, 4];
      const result = mergeSort(arr, (a, b) => a - b);
      expect(result).toEqual([1, 2, 4, 5, 8, 9]);
      expect(result).toBe(arr);
    });

    it('이미 정렬된 배열을 올바르게 처리하고, 그 배열을 반환해야 합니다', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = mergeSort(arr, (a, b) => a - b);
      expect(result).toEqual([1, 2, 3, 4, 5]);
      expect(result).toBe(arr);
    });

    it('역순으로 정렬된 배열을 올바르게 정렬하고, 그 배열을 반환해야 합니다', () => {
      const arr = [5, 4, 3, 2, 1];
      const result = mergeSort(arr, (a, b) => a - b);
      expect(result).toEqual([1, 2, 3, 4, 5]);
      expect(result).toBe(arr);
    });

    it('중복된 값이 있는 배열을 올바르게 정렬하고, 그 배열을 반환해야 합니다', () => {
      const arr = [5, 2, 8, 2, 9, 5];
      const result = mergeSort(arr, (a, b) => a - b);
      expect(result).toEqual([2, 2, 5, 5, 8, 9]);
      expect(result).toBe(arr);
    });

    it('문자열 배열을 알파벳순으로 정렬하고, 그 배열을 반환해야 합니다', () => {
      const arr = ['banana', 'apple', 'cherry', 'date'];
      const result = mergeSort(arr);
      expect(result).toEqual(['apple', 'banana', 'cherry', 'date']);
      expect(result).toBe(arr);
    });

    // mutable test
    it('원본 배열을 직접 수정하여 정렬해야 합니다', () => {
      const originalArr = [5, 2, 8, 1, 9, 4];
      const copyOfOriginal = [...originalArr];
      const result = mergeSort(originalArr, (a, b) => a - b);
      expect(originalArr).toEqual([1, 2, 4, 5, 8, 9]);
      expect(originalArr).not.toEqual(copyOfOriginal);
      expect(result).toBe(originalArr);
    });
  });

  // 2. 경계 케이스
  describe('경계 케이스', () => {
    it('빈 배열을 올바르게 처리하고, 그 배열을 반환해야 합니다', () => {
      const arr: number[] = [];
      const result = mergeSort(arr, (a, b) => a - b);
      expect(result).toEqual([]);
      expect(result).toBe(arr);
    });

    it('하나의 요소만 있는 배열을 올바르게 처리하고, 그 배열을 반환해야 합니다', () => {
      const arr = [42];
      const result = mergeSort(arr, (a, b) => a - b);
      expect(result).toEqual([42]);
      expect(result).toBe(arr);
    });

    it('두 개의 요소가 있는 배열을 올바르게 정렬하고, 그 배열을 반환해야 합니다', () => {
      const arr = [10, 5];
      const result = mergeSort(arr, (a, b) => a - b);
      expect(result).toEqual([5, 10]);
      expect(result).toBe(arr);
    });
  });

  // 3. 예외 및 특수 케이스
  describe('예외 및 특수 케이스', () => {
    it('사용자 정의 비교 함수를 사용하여 내림차순으로 정렬하고, 그 배열을 반환해야 합니다', () => {
      const arr = [5, 2, 8, 1, 9, 4];
      const result = mergeSort(arr, (a, b) => b - a);
      expect(result).toEqual([9, 8, 5, 4, 2, 1]);
      expect(result).toBe(arr);
    });

    it('비교 함수가 없을 때 기본 문자열 변환으로 정렬하고, 그 배열을 반환해야 합니다', () => {
      const arr = [10, 2, 'apple', 1];
      const result = mergeSort(arr);
      expect(result).toEqual([1, 10, 2, 'apple']);
      expect(result).toBe(arr);
    });

    it('사용자 정의 비교 함수를 사용하여 객체 배열을 정렬하고, 그 배열을 반환해야 합니다', () => {
      const arr = [
        {name: 'John', age: 30},
        {name: 'Jane', age: 25},
        {name: 'Doe', age: 35},
      ];
      const result = mergeSort(arr, (a, b) => a.age - b.age);
      expect(result).toEqual([
        {name: 'Jane', age: 25},
        {name: 'John', age: 30},
        {name: 'Doe', age: 35},
      ]);
      expect(result).toBe(arr);
    });

    it('null과 undefined 값이 포함된 배열을 처리하고, 그 배열을 반환해야 합니다', () => {
      const arr = [5, null, 2, undefined, 1];
      const result = mergeSort(arr);
      expect(result).toEqual([1, 2, 5, null, undefined]);
      expect(result).toBe(arr);
    });

    it('기본 비교 함수에서 두 번째 인자보다 첫 번째 인자가 사전적으로 클 경우를 테스트합니다', () => {
      const arr = [5, 1];
      const result = mergeSort(arr);
      expect(result).toEqual([1, 5]);
    });

    it('기본 비교 함수에서 두 인자가 사전적으로 동일할 경우를 테스트합니다', () => {
      const arr = [5, 5];
      const result = mergeSort(arr);
      expect(result).toEqual([5, 5]);
    });
  });
});
