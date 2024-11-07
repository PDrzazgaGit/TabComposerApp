import { Tabulature, IMeasure, ITuning, Note } from './../models'
import { MeasureService } from './';

export class TabulatureManager {
    private readonly tabulature: Tabulature;

    constructor(tuning: ITuning, public readonly frets: number = 24) {
        this.tabulature = new Tabulature(tuning);
    }

    public addMeasure(tempo: number, numerator: number, denominator: number) {
        const measure: MeasureService = new MeasureService(tempo, numerator, denominator, this.tabulature.tuning, this.frets);
        this.tabulature.addMeasure(measure);
    }

    public getMeasure(index: number): IMeasure | undefined{
        return this.tabulature.getMeasure(index);
    }


}