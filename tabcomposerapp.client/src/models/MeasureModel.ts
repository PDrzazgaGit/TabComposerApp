import { ITabulature, Note, Sound } from "./";
import { FretBoard } from './../structures';
import { GuitarScale } from './../services';
export interface IMeasure {
   tempo: number
}
export class Measure implements IMeasure {

    public strings: FretBoard<Note>;
    constructor(private readonly parentTablulature: ITabulature, public tempo: number) {

        this.strings = new FretBoard(this.parentTablulature.tuning.getSounds().length);
        
        //parent.tuning.strings.
    }

    public putNote(fret: number, string: number) {
        const baseSound: Sound = this.parentTablulature.tuning.getStringSound(string);
        const note: Note = GuitarScale.getNote(baseSound, fret);
        this.strings.add(string, note);
    }
    
}