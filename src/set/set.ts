import {ActionStatusCode, STATUS_CODE} from '../constants/statusCode';

export class KeyObjectSet<T extends Record<string | number, any>> {
  private key: keyof T;
  private keySet: Set<T[keyof T]>;
  private dataMap: Map<T[keyof T], T>;

  constructor(list: T[], key: keyof T) {
    if (!key) {
      throw new Error('원소의 고유한 key가 존재하지 않습니다.');
    }

    if (list.length > 0 && !(key in list[0])) {
      throw new Error(`제공된 key ${String(key)}가 list 원소에 존재하지 않습니다.`);
    }

    this.key = key;
    this.keySet = new Set();
    this.dataMap = new Map();

    for (const item of list) {
      const value = item[key];
      this.keySet.add(value);
      this.dataMap.set(value, item);
    }
  }

  get size(): number {
    return this.keySet.size;
  }

  find(value: T[keyof T]): T | undefined {
    return this.dataMap.get(value);
  }

  has(value: T[keyof T]): boolean {
    return this.keySet.has(value);
  }

  add(item: T): ActionStatusCode {
    const value = item[this.key];
    this.keySet.add(value);
    this.dataMap.set(value, item);

    return STATUS_CODE.SUCCESS;
  }

  delete(value: T[keyof T]): ActionStatusCode {
    if (!this.has(value)) {
      return STATUS_CODE.FAIL;
    }

    this.keySet.delete(value);
    this.dataMap.delete(value);
    return STATUS_CODE.SUCCESS;
  }

  values(): T[] {
    return Array.from(this.dataMap.values());
  }

  private checkKeyObjectSet(value: any): void {
    if (!(value instanceof KeyObjectSet)) {
      throw new Error('KeyObjectSet 인스턴스를 전달해야 합니다.');
    }
  }

  private checkSameKey(otherSet: KeyObjectSet<T>): void {
    if (this.key !== otherSet.key) {
      throw new Error('두 KeyObjectSet의 key가 일치하지 않습니다.');
    }
  }

  intersection(otherSet: KeyObjectSet<T>): KeyObjectSet<T> {
    this.checkKeyObjectSet(otherSet);
    this.checkSameKey(otherSet);

    const resultSet = new KeyObjectSet<T>([], this.key);

    for (const key of this.keySet) {
      if (otherSet.has(key)) {
        const item = this.dataMap.get(key);
        if (item) resultSet.add(item);
      }
    }

    return resultSet;
  }

  difference(otherSet: KeyObjectSet<T>): KeyObjectSet<T> {
    this.checkKeyObjectSet(otherSet);
    this.checkSameKey(otherSet);

    const result = new KeyObjectSet<T>([], this.key);

    for (const key of this.keySet) {
      if (!otherSet.has(key)) {
        const item = this.dataMap.get(key);
        if (item) result.add(item);
      }
    }

    return result;
  }

  union(otherSet: KeyObjectSet<T>): KeyObjectSet<T> {
    this.checkKeyObjectSet(otherSet);
    this.checkSameKey(otherSet);

    const result = new KeyObjectSet<T>(this.values(), this.key);

    for (const item of this.values()) {
      result.add(item);
    }

    for (const item of otherSet.values()) {
      const keyValue = item[this.key];
      if (!this.has(keyValue)) {
        result.add(item);
      }
    }

    return result;
  }
}
