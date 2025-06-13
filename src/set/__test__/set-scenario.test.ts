import {KeyObjectSet} from '../set';

type DataType = {id: number; name: string};

const ORIGIN = `{id: 1, name: 'cookie'}, {id: 2, name: 'weadie'}, {id: 3, name: 'prune'}`;
const OTHER = `{id: 1, name: 'cookie'}, {id: 4, name: 'soosoo'}`;
const OTHER_SAME_KEY_BUT_DIFFERENCE_VALUE = `{id: 1, name: 'oliy'}, {id: 4, name: 'soosoo'}`;

const listToString = (list: DataType[]): string => {
  return list.map(item => `id: ${item.id}, name: ${item.name}`).join('\n');
};

describe('Set Scenario Test', () => {
  let sampleList: DataType[] = [
    {id: 1, name: 'cookie'},
    {id: 2, name: 'weadie'},
    {id: 3, name: 'prune'},
  ];
  let sampleSet: KeyObjectSet<DataType>;

  beforeEach(() => {
    sampleSet = new KeyObjectSet(sampleList, 'id');
  });

  describe('1. find scenario', () => {
    const TARGET_NAME = sampleList[1];

    it(`${ORIGIN}의 집합에서 2번을 찾으면 {id: 2, name: 'weadie'}이다.`, () => {
      const FIND_VALUE = 2;
      expect(sampleSet.find(FIND_VALUE)).toBe(TARGET_NAME);
    });
  });

  describe('2. has scenario', () => {
    it(`${ORIGIN}의 집합에서 2번을 찾으면 true다.`, () => {
      const FIND_VALUE = 2;
      expect(sampleSet.find(FIND_VALUE)).toBeTruthy();
    });

    it(`${ORIGIN}의 집합에서 4번을 찾으면 false다.`, () => {
      const FIND_VALUE = 4;
      expect(sampleSet.find(FIND_VALUE)).toBeFalsy();
    });
  });

  describe('3. add scenario', () => {
    it(`${ORIGIN}의 집합에서 {id: 4, name: 'soosoo'}를 추가한다.`, () => {
      const NEW_ELEMENT: DataType = {id: 4, name: 'soosoo'};
      sampleSet.add(NEW_ELEMENT);
      const expected = [...sampleList, NEW_ELEMENT];
      expect(sampleSet.values()).toEqual(expect.arrayContaining(expected));
    });

    it(`${ORIGIN}의 집합에서 {id: 3, name: 'soosoo'}를 추가하면 id 3의 name은 soosoo가 된다.`, () => {
      const NEW_ELEMENT: DataType = {id: 3, name: 'soosoo'};
      sampleSet.add(NEW_ELEMENT);
      const expected = [{id: 1, name: 'cookie'}, {id: 2, name: 'weadie'}, NEW_ELEMENT];
      expect(sampleSet.values()).toEqual(expect.arrayContaining(expected));
    });
  });

  describe('4. delete scenario', () => {
    it(`${ORIGIN}의 집합에서 id 2을 삭제한다.`, () => {
      const DELETE_ID = 2;
      sampleSet.delete(DELETE_ID);
      const expected = [
        {id: 1, name: 'cookie'},
        {id: 3, name: 'prune'},
      ];
      expect(sampleSet.values()).toEqual(expect.arrayContaining(expected));
    });

    it(`${ORIGIN}의 집합에서 id 4를 삭제하면 원본 그대로이다.`, () => {
      const DELETE_ID = 4;
      sampleSet.delete(DELETE_ID);
      expect(sampleSet.values()).toEqual(expect.arrayContaining(sampleList));
    });
  });

  describe('5. intersection scenario', () => {
    it(`${ORIGIN}의 집합과 ${OTHER}의 교집합은 ${listToString([sampleList[0]])}이다.`, () => {
      const otherList: DataType[] = [
        {id: 1, name: 'cookie'},
        {id: 4, name: 'soosoo'},
      ];
      const otherSet = new KeyObjectSet(otherList, 'id');
      const expected = [sampleList[0]];
      expect(sampleSet.intersection(otherSet).values()).toEqual(expect.arrayContaining(expected));
    });

    it(`${ORIGIN}의 집합과 ${OTHER_SAME_KEY_BUT_DIFFERENCE_VALUE}의 교집합은 ${listToString([sampleList[0]])}이다.`, () => {
      const otherList: DataType[] = [
        {id: 1, name: 'oliy'},
        {id: 4, name: 'soosoo'},
      ];
      const otherSet = new KeyObjectSet(otherList, 'id');
      const expected = [sampleList[0]];
      expect(sampleSet.intersection(otherSet).values()).toEqual(expect.arrayContaining(expected));
    });

    it(`${ORIGIN}의 집합과 공집합의 교집합은 공집합이다.`, () => {
      const otherSet = new KeyObjectSet<DataType>([], 'id');
      expect(sampleSet.intersection(otherSet).values()).toHaveLength(0);
    });

    it(`${ORIGIN}의 집합과 자기자신의 교집합은 자기자신이다.`, () => {
      expect(sampleSet.intersection(sampleSet).values()).toEqual(expect.arrayContaining(sampleList));
    });
  });

  describe('6. difference scenario', () => {
    it(`${ORIGIN}의 집합과 ${OTHER}의 차집합은 ${listToString([sampleList[1], sampleList[2]])}이다.`, () => {
      const otherList: DataType[] = [
        {id: 1, name: 'cookie'},
        {id: 4, name: 'soosoo'},
      ];
      const otherSet = new KeyObjectSet(otherList, 'id');
      const expected = [sampleList[1], sampleList[2]];
      expect(sampleSet.difference(otherSet).values()).toEqual(expect.arrayContaining(expected));
    });

    it(`${ORIGIN}의 집합과 자기자신의 차집합은 공집합이다.`, () => {
      expect(sampleSet.difference(sampleSet).values()).toHaveLength(0);
    });
  });

  describe('7. union scenario', () => {
    const UNION = `{id: 1, name: 'cookie'}, {id: 2, name: 'weadie'}, {id: 3, name: 'prune'}, {id: 4, name: 'soosoo'}`;

    it(`${ORIGIN}의 집합과 ${OTHER}의 합집합은 ${UNION}이다.`, () => {
      const otherList: DataType[] = [
        {id: 1, name: 'cookie'},
        {id: 4, name: 'soosoo'},
      ];
      const otherSet = new KeyObjectSet(otherList, 'id');
      const expected = [
        {id: 1, name: 'cookie'},
        {id: 2, name: 'weadie'},
        {id: 3, name: 'prune'},
        {id: 4, name: 'soosoo'},
      ];
      expect(sampleSet.union(otherSet).values()).toEqual(expect.arrayContaining(expected));
    });

    it(`${ORIGIN}의 집합과 ${OTHER_SAME_KEY_BUT_DIFFERENCE_VALUE}의 합집합은 ${UNION}이다.`, () => {
      const otherList: DataType[] = [
        {id: 1, name: 'oliy'},
        {id: 4, name: 'soosoo'},
      ];
      const otherSet = new KeyObjectSet(otherList, 'id');
      const expected = [
        {id: 1, name: 'cookie'},
        {id: 2, name: 'weadie'},
        {id: 3, name: 'prune'},
        {id: 4, name: 'soosoo'},
      ];
      expect(sampleSet.union(otherSet).values()).toEqual(expect.arrayContaining(expected));
    });

    it(`${ORIGIN}의 집합과 공집합의 합집합은 ${ORIGIN}이다.`, () => {
      const otherSet = new KeyObjectSet<DataType>([], 'id');
      expect(sampleSet.union(otherSet).values()).toEqual(expect.arrayContaining(sampleList));
    });

    it(`${ORIGIN}의 집합과 자기자신의 합집합은 자기자신이다.`, () => {
      expect(sampleSet.union(sampleSet).values()).toEqual(expect.arrayContaining(sampleList));
    });
  });
});
