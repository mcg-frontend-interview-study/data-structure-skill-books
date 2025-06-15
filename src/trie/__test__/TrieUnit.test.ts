import { STATUS_CODE } from '../../constants/statusCode';
import { Trie } from '../Trie';

describe('Trie test', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = new Trie<any>();
  });

  describe('insert 메서드', () => {
    it('key를 저장하고 검색할 수 있다', () => {
      const statusCode = trie.insert('안녕하세요', '우하하');
      expect(statusCode).toBe(STATUS_CODE.SUCCESS);
    });

    it('여러 개의 단어를 저장할 수 있다', () => {
      expect(trie.insert('안녕하세요', '우하하')).toBe(STATUS_CODE.SUCCESS);
      expect(trie.insert('하이', '헬로우')).toBe(STATUS_CODE.SUCCESS);
    });

    it('같은 단어를 저장하면 덮어쓴다', () => {
      expect(trie.insert('안녕하세요', '우하하')).toBe(STATUS_CODE.SUCCESS);
      expect(trie.insert('안녕하세요', '안녕')).toBe(STATUS_CODE.SUCCESS);
      expect(trie.search('안녕하세요')).toBe('안녕');
    });
  });

  describe('search 메서드', () => {
    beforeEach(() => {
      trie.insert('안녕하세요', '우하하');
      trie.insert('하이', '헬로우');
    });

    it('저장된 단어를 검색하면 해당 값을 반환한다', () => {
      expect(trie.search('안녕하세요')).toBe('우하하');
      expect(trie.search('하이')).toBe('헬로우');
    });

    it('저장되지 않은 값을 검색하면 NOT_FOUND를 반환한다', () => {
      expect(trie.search('저장된 단어가 없어요')).toBe(STATUS_CODE.NOT_FOUND);
    });

    it('일부만 동일한 문자열을 검색하면 NOT_FOUND를 반환한다', () => {
      expect(trie.search('안녕')).toBe(STATUS_CODE.NOT_FOUND);
      expect(trie.search('하이이')).toBe(STATUS_CODE.NOT_FOUND);
    });
  });

  describe('delete 메서드', () => {
    beforeEach(() => {
      trie.insert('안녕하세요', '우하하');
      trie.insert('하이', '헬로우');
    });

    it('저장된 단어를 삭제할 수 있다', () => {
      expect(trie.delete('안녕하세요')).toBe(STATUS_CODE.SUCCESS);
      expect(trie.search('안녕하세요')).toBe(STATUS_CODE.NOT_FOUND);
    });

    it('저장되지 않은 값을 삭제해도 SUCCESS를 반환한다', () => {
      expect(trie.delete('저장된 단어가 없어요')).toBe(STATUS_CODE.SUCCESS);
    });

    it('삭제 후 다른 단어는 영향받지 않는다', () => {
      trie.delete('안녕하세요');
      expect(trie.search('하이')).toBe('헬로우');
    });
  });
});
