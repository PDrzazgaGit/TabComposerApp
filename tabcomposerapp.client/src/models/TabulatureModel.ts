import { ITuning, IMeasure } from "./";

export interface ITabulature {
    readonly tuning: ITuning;
    forEach(callback: (measure: IMeasure) => void): void
}

export class Tabulature implements ITabulature {
    private readonly measures: IMeasure[] = [];
    public constructor(public readonly tuning: ITuning) { }

    public forEach(callback: (measure: IMeasure) => void): void {
        this.measures.forEach(callback);
    }

    public addMeasure(measure: IMeasure): void {
        this.measures.push(measure);
    }

    public getMeasure(index: number): IMeasure | undefined {
        return this.measures[index];
    }
}