import { Tuning, ITuning, Measure, IMeasure } from "./";

export interface ITabulature {
    readonly tuning: ITuning;
}

export class Tabulature implements ITabulature {
    private readonly measures: Measure[] = [];
    public constructor(public readonly tuning: ITuning) { }

    public forEach(callback: (measure: IMeasure) => void): void {
        this.measures.forEach(callback);
    }
}