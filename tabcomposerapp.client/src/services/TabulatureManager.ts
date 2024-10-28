import { Tabulature, IMeasure, ITuning, Note } from './../models'
import { Measure } from './';

export class TabulatureManager {
    private readonly tabulature: Tabulature;

    constructor(tuning: ITuning, public readonly frets: number = 24) {
        this.tabulature = new Tabulature(tuning);
    }

    public addMeasure(tempo: number, numerator: number, denominator: number) {
        const measure: Measure = new Measure(tempo, numerator, denominator, this.tabulature.tuning, this.frets);
        this.tabulature.addMeasure(measure);
    }

    public getMeasure(index: number): IMeasure | undefined{
        return this.tabulature.getMeasure(index);
    }

    public getTabulaturePrintedString(): string {
        const tab: string[] = [];
        this.tabulature.forEach(measure => {
            measure.forEach((number, notes) => {
                notes.forEach(mayNote => {
                    if (mayNote instanceof Note) {
                        tab[number] += mayNote.fret.toString();
                    }
                })
            })
        })
        return "";
    }
}