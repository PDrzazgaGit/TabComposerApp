import { ITuning, IMeasure } from "./";

export interface ITabulature {
    readonly tuning: ITuning;
    forEach(callback: (measure: IMeasure) => void): void;
    map<U>(callback: (measure: IMeasure, index: number, array: IMeasure[]) => U): U[];
    find(callback: (measure: IMeasure) => boolean): IMeasure | undefined;
    updateTablature(oldM: IMeasure | number, newM: IMeasure): void;
}

export class Tabulature implements ITabulature {

   

    private readonly measures: IMeasure[] = [];
    public constructor(public readonly tuning: ITuning, public title: string = "Untilted track") { }

    public forEach(callback: (measure: IMeasure) => void): void {
        this.measures.forEach(callback);
    }

    public map<U>(callback: (measure: IMeasure, index: number, array: IMeasure[]) => U): U[] {
        return this.measures.map(callback);
    }

    public addMeasure(measure: IMeasure): void {
        const existingMeasure = this.measures.find(m => m === measure);
        if (existingMeasure) {
            throw new Error(`Cannot add multiple references to measures.`);
        }
        this.measures.push(measure);
    }

    public getMeasure(index: number): IMeasure | undefined {
        return this.measures[index];
    }

    public find(callback: (measure: IMeasure) => boolean): IMeasure | undefined {
        return this.measures.find(callback); 
    }

    public findIndex(measure: IMeasure): number {
        return this.measures.findIndex(m => m === measure);
    }

    public updateTablature(oldM: IMeasure | number, newM: IMeasure) {
        let index: number;
        if (typeof oldM === "number") {
            index = oldM;
        } else {
           
            index = this.measures.findIndex(m => m === oldM as IMeasure);
        }
        this.measures[index] = newM;
    }
}