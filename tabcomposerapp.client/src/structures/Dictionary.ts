/*
type DictionaryType<Key extends keyof never, Value> = {
    [key in Key]: Value; // Mapped types syntax
};
*/
export class Dictionary<Key extends string | number | symbol, Value> {
    private items: { [key in Key]: Value } = {} as { [key in Key]: Value };

    constructor(initialValues?: { [key in Key]: Value }) {
        if (initialValues) {
            this.items = { ...initialValues };
        }
    }

    add(key: Key, value: Value): void {
        this.items[key] = value;
    }

    get(key: Key): Value | undefined {
        return this.items[key];
    }

    remove(key: Key): void {
        delete this.items[key];
    }

    has(key: Key): boolean {
        return key in this.items;
    }

    keys(): Key[] {
        return Object.keys(this.items) as Key[];
    }

    values(): Value[] {
        return Object.values(this.items);
    }

    entries(): [Key, Value][] {
        return Object.entries(this.items) as [Key, Value][];
    }

    keysLength(): number {
        return this.keys().length;
    }

    forEach(callback: (key: Key, value: Value) => void): void {
        for (const [key, value] of this.entries()) {
            callback(key, value);
        }
    }
}
