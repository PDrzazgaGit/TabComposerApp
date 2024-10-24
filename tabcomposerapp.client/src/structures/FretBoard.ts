import { Dictionary } from "./";
export class FretBoard<T> {
    private strings: Dictionary<number, Array<T>> = new Dictionary();
    constructor(private size: number) {
        if (size <= 0) {
            throw new Error("FretBoard must contain at least one string.");
        }
        for (let i = 1; i < size+1; i++) {
            this.strings.add(i, new Array<T>);
        }
    }

    public length(): number {
        return this.size;
    }

    public add(stringNumber: number, value: T) {
        if (stringNumber < 1 || stringNumber > this.size) {
            throw new Error("There is no string with number: " + stringNumber +". ");
        }
        this.strings.get(stringNumber)?.push(value);
    }

    public forEach(callback: (key: number, value: Array<T>) => void): void {
        this.strings.forEach(callback);
    }
}