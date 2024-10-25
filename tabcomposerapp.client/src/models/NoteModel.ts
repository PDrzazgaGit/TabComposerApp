import { Sound, Notation } from "./";

export enum NoteDuration {
    Whole = 1,
    Half = 1 / 2,
    Quarter = 1 / 4,
    Eighth = 1 / 8,
    Sixteenth = 1 / 16,
    Thirtytwo = 1 / 32
}

export class Note extends Sound {
    public readonly fret: number;
    public readonly noteDuration: NoteDuration;
    public readonly timeStamp: number;
    constructor(
        sound: Sound,
        fret: number,   
        noteDurationMs?: number,
        noteDuration?: NoteDuration,
        timeStamp?: number
    );
    constructor(
        frequency: number,
        notation: Notation,
        octave: number,
        fret: number,  
        noteDurationMs?: number,
        noteDuration?: NoteDuration,
        timeStamp?: number
    );
    constructor(
        frequencyOrSound: number | Sound,
        notationOrFret?: Notation | number,
        octave?: number,
        fret: number = 0,
        noteDurationMs: number = 500,
        noteDuration: NoteDuration = NoteDuration.Quarter,
        timeStamp: number = 0
    ) {
        if (frequencyOrSound instanceof Sound) { // Note(sound, fret)
            super(frequencyOrSound.frequency, frequencyOrSound.notation, frequencyOrSound.octave, noteDurationMs);
            this.fret = notationOrFret as number; 
            this.noteDuration = noteDuration;
            this.timeStamp = timeStamp;
        } else {
            super(frequencyOrSound, notationOrFret as Notation, octave!, noteDurationMs);
            this.fret = fret;
            this.noteDuration = noteDuration;
            this.timeStamp = timeStamp;
        }
    }
}
