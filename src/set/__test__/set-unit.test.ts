import {STATUS_CODE} from '../../constants/statusCode';
import {KeyObjectSet} from '../set';

type DataType = {id: number; name: string};

const testSetOperationValidation = (
  operationName: 'intersection' | 'difference' | 'union',
  operation: (set: KeyObjectSet<any>) => any,
) => {
  describe(`${operationName} 예외 테스트`, () => {
    it('KeyObjectSet 인스턴스가 아니면 예외를 던진다.', () => {
      // @ts-expect-error intentionally wrong
      expect(() => operation({})).toThrow('KeyObjectSet 인스턴스를 전달해야 합니다.');
    });

    it('key가 서로 다르면 예외를 던진다.', () => {
      const otherSet = new KeyObjectSet([{uuid: 1, name: 'hello'}], 'uuid');
      expect(() => operation(otherSet)).toThrow('두 KeyObjectSet의 key가 일치하지 않습니다.');
    });
  });
};

describe('Set Unit Test', () => {
  let sampleList: DataType[] = [
    {id: 1, name: 'cookie'},
    {id: 2, name: 'weadie'},
    {id: 3, name: 'prune'},
  ];
  let sampleSet: KeyObjectSet<DataType>;

  beforeEach(() => {
    sampleSet = new KeyObjectSet(sampleList, 'id');
  });

  describe('1. 생성자 예외 테스트', () => {
    it('key가 주어지지 않으면 예외를 던진다.', () => {
      const list = [{id: 1, name: 'cookie'}];
      // @ts-expect-error 일부러 key를 undefined로 전달
      expect(() => new KeyObjectSet(list, undefined)).toThrow('원소의 고유한 key가 존재하지 않습니다.');
    });

    it('key가 T에 존재하지 않으면 예외를 던진다 (list가 비어있지 않을 때)', () => {
      const list = [{id: 1, name: 'cookie'}];
      const INVALID_KEY = 'age';
      // @ts-expect-error 일부러 잘못된 key를 전달
      expect(() => new KeyObjectSet(list, INVALID_KEY)).toThrow(
        `제공된 key ${INVALID_KEY}가 list 원소에 존재하지 않습니다.`,
      );
    });

    it('list가 빈 배열이면 key 유효성 검사를 하지 않는다.', () => {
      expect(() => new KeyObjectSet([], 'invalidKey' as any)).not.toThrow();
    });
  });

  describe('2. find test', () => {
    const TARGET_NAME = 'weadie';

    it(`id가 2인 원소를 찾으면 그 이름은 ${TARGET_NAME}이다.`, () => {
      const FIND_VALUE = 2;
      expect(sampleSet.find(FIND_VALUE)?.name).toBe(TARGET_NAME);
    });

    it(`id가 4인 원소를 찾으면 결과는 undefined이다.`, () => {
      const FIND_VALUE = 4;
      expect(sampleSet.find(FIND_VALUE)).toBeUndefined();
    });
  });

  describe('3. has test', () => {
    it(`id가 2인 원소가 set 안에 있다.`, () => {
      const FIND_VALUE = 2;
      expect(sampleSet.has(FIND_VALUE)).toBeTruthy();
    });

    it(`id가 4인 원소가 set 안에 없다.`, () => {
      const FIND_VALUE = 4;
      expect(sampleSet.has(FIND_VALUE)).toBeFalsy();
    });
  });

  describe('4. add test', () => {
    it('새 원소를 추가하면 SUCCESS를 반환하고 set에 포함된다', () => {
      const TARGET_NAME = 'sunday';
      const newElement = {id: 4, name: TARGET_NAME};

      const result = sampleSet.add(newElement);
      expect(result).toBe(STATUS_CODE.SUCCESS);

      const found = sampleSet.find(newElement.id);
      expect(found?.name).toBe(TARGET_NAME);

      expect(sampleSet.size).toBe(sampleList.length + 1);
    });

    it('기존 key에 다른 내용을 추가하면 SUCCESS를 반환하고 다른 내용으로 덮어씌워진다.', () => {
      const TARGET_NAME = 'oliy';
      const updatedElement = {id: 2, name: TARGET_NAME};

      const result = sampleSet.add(updatedElement);
      expect(result).toBe(STATUS_CODE.SUCCESS);

      const found = sampleSet.find(updatedElement.id);
      expect(found?.name).toBe(TARGET_NAME);

      expect(sampleSet.size).toBe(sampleList.length);
    });
  });

  describe('5. delete test', () => {
    it('존재하는 id를 삭제하면 SUCCESS를 반환하고 set에서 제거된다.', () => {
      const DELETE_ID = 2;

      const result = sampleSet.delete(DELETE_ID);
      expect(result).toBe(STATUS_CODE.SUCCESS);

      const found = sampleSet.find(DELETE_ID);
      expect(found).toBeUndefined();

      expect(sampleSet.size).toBe(sampleList.length - 1);
    });

    it('존재하지 않는 id를 삭제하면 FAIL을 반환하고 set은 변경되지 않는다.', () => {
      const DELETE_ID = 999;

      const result = sampleSet.delete(DELETE_ID);
      expect(result).toBe(STATUS_CODE.FAIL);

      expect(sampleSet.size).toBe(sampleList.length);
    });
  });

  describe('6. values test', () => {
    it('초기 값들을 모두 반환한다.', () => {
      const values = sampleSet.values();

      expect(values).toHaveLength(sampleList.length);
      expect(values).toEqual(expect.arrayContaining(sampleList));
    });

    it('요소를 추가하거나 삭제한 후 values를 호출하면 최신의 상태가 반환된다', () => {
      const newElement = {id: 4, name: 'monday'};
      sampleSet.add(newElement);

      sampleSet.delete(1);

      const values = sampleSet.values();
      const expected = [sampleList[1], sampleList[2], newElement]; // id: 2, 3, 4

      expect(values).toHaveLength(3);
      expect(values).toEqual(expect.arrayContaining(expected));
    });
  });

  describe('7. intersection test', () => {
    testSetOperationValidation('intersection', otherSet => sampleSet.intersection(otherSet));

    describe('intersection 동작 테스트', () => {
      it('공통된 원소만 반환한다.', () => {
        const otherSet = new KeyObjectSet(
          [
            {id: 2, name: 'weadie'},
            {id: 4, name: 'soosoo'},
          ],
          'id',
        );
        const expected = [{id: 2, name: 'weadie'}];

        const result = sampleSet.intersection(otherSet);
        expect(result.size).toBe(1);
        expect(result.values()).toEqual(expect.arrayContaining(expected));
      });

      it('origin key와 other의 key 값이 동일하다면 origin key의 value를 교집합으로 반환한다.', () => {
        const otherSet = new KeyObjectSet(
          [
            {id: 2, name: 'cookie'},
            {id: 4, name: 'soosoo'},
          ],
          'id',
        );
        const expected = [{id: 2, name: 'weadie'}];

        const result = sampleSet.intersection(otherSet);
        expect(result.size).toBe(1);
        expect(result.values()).toEqual(expect.arrayContaining(expected));
      });

      it('공통된 원소가 없으면 빈 Set을 반환한다.', () => {
        const otherSet = new KeyObjectSet(
          [
            {id: 100, name: 'soosoo'},
            {id: 200, name: 'todari'},
          ],
          'id',
        );

        const result = sampleSet.intersection(otherSet);
        expect(result.size).toBe(0);
        expect(result.values()).toEqual([]);
      });
    });
  });

  describe('8. difference test', () => {
    testSetOperationValidation('difference', otherSet => sampleSet.difference(otherSet));

    describe('difference 동작 테스트', () => {
      it('otherSet 기준으로 차집합 원소를 반환한다.', () => {
        const otherSet = new KeyObjectSet(
          [
            {id: 2, name: 'weadie'},
            {id: 4, name: 'soosoo'},
          ],
          'id',
        );
        const expected = [{id: 4, name: 'soosoo'}];

        const result = otherSet.difference(sampleSet);
        expect(result.size).toBe(1);
        expect(result.values()).toEqual(expect.arrayContaining(expected));
      });

      it('차집합 원소가 없으면 빈 Set을 반환한다.', () => {
        const otherSet = new KeyObjectSet(
          [
            {id: 1, name: 'cookie'},
            {id: 2, name: 'weadie'},
          ],
          'id',
        );

        const result = otherSet.difference(sampleSet);
        expect(result.size).toBe(0);
        expect(result.values()).toEqual([]);
      });
    });
  });

  describe('9. union test', () => {
    testSetOperationValidation('union', otherSet => sampleSet.union(otherSet));

    describe('union 동작 테스트', () => {
      it('sampleSet과 otherSet의 합집합을 반환한다.', () => {
        const otherSet = new KeyObjectSet(
          [
            {id: 2, name: 'weadie'},
            {id: 4, name: 'soosoo'},
          ],
          'id',
        );

        const expected = [...sampleList, {id: 4, name: 'soosoo'}];

        const result = otherSet.union(sampleSet);
        expect(result.size).toBe(4);
        expect(result.values()).toEqual(expect.arrayContaining(expected));
      });

      it('sampleSet과 otherSet에서 동일한 key가 있을 때 sampleSet을 기준으로 합집합을 반환한다.', () => {
        const otherSet = new KeyObjectSet(
          [
            {id: 2, name: 'cookie'},
            {id: 4, name: 'soosoo'},
          ],
          'id',
        );

        const expected = [...sampleList, {id: 4, name: 'soosoo'}];

        const result = sampleSet.union(otherSet);
        expect(result.size).toBe(4);
        expect(result.values()).toEqual(expect.arrayContaining(expected));
      });
    });
  });
});
