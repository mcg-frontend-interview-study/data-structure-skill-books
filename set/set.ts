export class KeyObjectSet<T extends Record<string | number, any>> {
  private key: keyof T;
  private keySet: Set<T[keyof T]>;
  private dataMap: Map<T[keyof T], T>;

  constructor(list: T[], key: keyof T) {
    if (!key) {
      throw new Error("원소의 고유한 key가 존재하지 않습니다.");
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

  find(value: T[keyof T]): T | undefined {
    return this.dataMap.get(value);
  }

  has(value: T[keyof T]): boolean {
    return this.keySet.has(value);
  }

  add(item: T): void {
    const value = item[this.key];
    this.keySet.add(value);
    this.dataMap.set(value, item);
  }

  delete(value: T[keyof T]): void {
    this.keySet.delete(value);
    this.dataMap.delete(value);
  }

  values(): T[] {
    return Array.from(this.dataMap.values());
  }

  size(): number {
    return this.keySet.size;
  }

  intersection(otherSet: KeyObjectSet<T>): KeyObjectSet<T> {
    const smaller = this.size() < otherSet.size() ? this : otherSet;
    const larger = this.size() < otherSet.size() ? otherSet : this;

    const resultSet = new KeyObjectSet<T>([], this.key);

    for (const key of smaller.keySet) {
      if (larger.has(key)) {
        const item = smaller.dataMap.get(key);
        if (item) resultSet.add(item);
      }
    }

    return resultSet;
  }

  difference(otherSet: KeyObjectSet<T>): KeyObjectSet<T> {
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
    const result = new KeyObjectSet<T>(this.values(), this.key);
    for (const item of otherSet.values()) {
      result.add(item);
    }

    return result;
  }
}
