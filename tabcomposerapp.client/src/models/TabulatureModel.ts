import { ITuning, IMeasure } from "./";

export interface ITabulature {
    readonly tuning: ITuning;
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
}