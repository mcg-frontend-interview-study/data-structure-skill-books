import { STATUS_CODE } from '../constants/statusCode';
export class KeyObjectSet {
    key;
    keySet;
    dataMap;
    constructor(list, key) {
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
    get size() {
        return this.keySet.size;
    }
    find(value) {
        return this.dataMap.get(value);
    }
    has(value) {
        return this.keySet.has(value);
    }
    add(item) {
        const value = item[this.key];
        this.keySet.add(value);
        this.dataMap.set(value, item);
        return STATUS_CODE.SUCCESS;
    }
    delete(value) {
        if (!this.has(value)) {
            return STATUS_CODE.FAIL;
        }
        this.keySet.delete(value);
        this.dataMap.delete(value);
        return STATUS_CODE.SUCCESS;
    }
    values() {
        return Array.from(this.dataMap.values());
    }
    checkKeyObjectSet(value) {
        if (!(value instanceof KeyObjectSet)) {
            throw new Error('KeyObjectSet 인스턴스를 전달해야 합니다.');
        }
    }
    checkSameKey(otherSet) {
        if (this.key !== otherSet.key) {
            throw new Error('두 KeyObjectSet의 key가 일치하지 않습니다.');
        }
    }
    intersection(otherSet) {
        this.checkKeyObjectSet(otherSet);
        this.checkSameKey(otherSet);
        const resultSet = new KeyObjectSet([], this.key);
        for (const key of this.keySet) {
            if (otherSet.has(key)) {
                const item = this.dataMap.get(key);
                if (item)
                    resultSet.add(item);
            }
        }
        return resultSet;
    }
    difference(otherSet) {
        this.checkKeyObjectSet(otherSet);
        this.checkSameKey(otherSet);
        const result = new KeyObjectSet([], this.key);
        for (const key of this.keySet) {
            if (!otherSet.has(key)) {
                const item = this.dataMap.get(key);
                if (item)
                    result.add(item);
            }
        }
        return result;
    }
    union(otherSet) {
        this.checkKeyObjectSet(otherSet);
        this.checkSameKey(otherSet);
        const result = new KeyObjectSet(this.values(), this.key);
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
