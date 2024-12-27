import { makeAutoObservable } from "mobx";
import { TuningFactory } from "../services";
import { MeasureService, SerializedMeasure, SerializedNote } from "../services/MeasureService";
import { ITuning, IMeasure, SerializedTuning } from "./";

export interface ITabulature {
    title: string;
    author: string;
    frets: number;
    description?: string;
    readonly tuning: ITuning;
    getLength(): number;
    forEach(callback: (measure: IMeasure) => void): void;
    map<U>(callback: (measure: IMeasure, index: number, array: IMeasure[]) => U): U[];
    find(callback: (measure: IMeasure) => boolean): IMeasure | undefined;
    updateTablature(oldM: IMeasure | number, newM: IMeasure): void;
    addMeasure(tempo: number, numerator: number, denominator: number): void;
    deleteMeasure(measure: IMeasure): void;
    getMeasure(index: number): IMeasure | undefined;
    addMeasureObject(measure: IMeasure): boolean;
    clone(): ITabulature;
}

export class Tabulature implements ITabulature {

    private measures: IMeasure[] = [];
    public constructor(public readonly tuning: ITuning, public frets: number = 24, public title: string = "Untilted track", public author: string = "unknown", public description: string = "") {
        makeAutoObservable(this);
    }

    public getLength(): number {
        return this.measures.length;
    }

    public clone(): ITabulature {
        const clone = new Tabulature(this.tuning, this.frets, this.title);
        clone.measures = this.measures;
        return clone;
    }

    public count(): number {
        return this.measures.length;
    }

    public forEach(callback: (measure: IMeasure) => void): void {
        this.measures.forEach(callback);
    }

    public map<U>(callback: (measure: IMeasure, index: number, array: IMeasure[]) => U): U[] {
        return this.measures.map(callback);
    }

    public addMeasure(tempo: number, numerator: number, denominator: number): void | IMeasure {
        const measure: MeasureService = new MeasureService(tempo, numerator, denominator, this.tuning, this.frets);
        this.measures.push(measure);
        return measure;
    }

    public addMeasureObject(measure: IMeasure): boolean {
        const exists = this.measures.some(m => m === measure);

        if (exists) {
            return false;
        }
        this.measures.push(measure);
        return true;
    }

    public deleteMeasure(measure: IMeasure) {
        const measureIndex = this.measures.indexOf(measure);
        if (measureIndex === -1) {
            throw Error("Cannot delete inexisting measure");
        }
        this.measures.splice(measureIndex, 1);
        console.log(this.measures);
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