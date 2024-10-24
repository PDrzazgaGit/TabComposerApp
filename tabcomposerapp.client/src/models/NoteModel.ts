import { Sound, Notation } from "./";

export class Note extends Sound {
    constructor(
        frequency: number,
        notation: Notation,
        octave: number,
        public readonly fret: number) {
        super(frequency, notation, octave);
    }
}