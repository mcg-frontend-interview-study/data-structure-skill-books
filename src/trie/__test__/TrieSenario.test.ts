import { STATUS_CODE } from '../../constants/statusCode';
import { Trie } from '../Trie';

describe('Trie 시나리오 테스트', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = new Trie<any>();
  });

  it('사전 기능을 구현할 수 있다', () => {
    trie.insert('apple', '사과');
    trie.insert('banana', '바나나');
    trie.insert('orange', '오렌지');

    expect(trie.search('apple')).toBe('사과');
    expect(trie.search('banana')).toBe('바나나');
    expect(trie.search('orange')).toBe('오렌지');

    trie.delete('banana');
    expect(trie.search('banana')).toBe(STATUS_CODE.NOT_FOUND);

    expect(trie.search('apple')).toBe('사과');
    expect(trie.search('orange')).toBe('오렌지');
  });

  it('자동완성 기능을 구현할 수 있다', () => {
    trie.insert('hello', 'hello');
    trie.insert('help', 'help');
    trie.insert('hell', 'hell');

    expect(trie.search('hello')).toBe('hello');
    expect(trie.search('help')).toBe('help');
    expect(trie.search('hell')).toBe('hell');

    trie.delete('help');
    expect(trie.search('help')).toBe(STATUS_CODE.NOT_FOUND);

    expect(trie.search('hello')).toBe('hello');
    expect(trie.search('hell')).toBe('hell');
  });

  interface Contact {
    name: string;
    phone: string;
  }

  it('전화번호부 기능을 구현할 수 있다', () => {
    const phoneBook = new Trie<Contact>();

    phoneBook.insert('홍길동', { name: '홍길동', phone: '010-1234-5678' });
    phoneBook.insert('김철수', { name: '김철수', phone: '010-8765-4321' });

    expect(phoneBook.search('홍길동')).toEqual({
      name: '홍길동',
      phone: '010-1234-5678',
    });
    expect(phoneBook.search('김철수')).toEqual({
      name: '김철수',
      phone: '010-8765-4321',
    });

    phoneBook.delete('홍길동');
    expect(phoneBook.search('홍길동')).toBe(STATUS_CODE.NOT_FOUND);
    expect(phoneBook.search('김철수')).toEqual({
      name: '김철수',
      phone: '010-8765-4321',
    });
  });
});
