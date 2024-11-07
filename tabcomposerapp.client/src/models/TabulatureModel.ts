import { ITuning, IMeasure } from "./";

export interface ITabulature {
    readonly tuning: ITuning;
    forEach(callback: (measure: IMeasure) => void): void;
    map<U>(callback: (measure: IMeasure, index: number, array: IMeasure[]) => U): U[];
}

export class Tabulature implements ITabulature {
    private readonly measures: IMeasure[] = [];
    public constructor(public readonly tuning: ITuning) { }

    public forEach(callback: (measure: IMeasure) => void): void {
        this.measures.forEach(callback);
    }

    public map<U>(callback: (measure: IMeasure, index: number, array: IMeasure[]) => U): U[] {
        return this.measures.map(callback);
    }

    public addMeasure(measure: IMeasure): void {
        this.measures.push(measure);
    }

    public getMeasure(index: number): IMeasure | undefined {
        return this.measures[index];
    }
}