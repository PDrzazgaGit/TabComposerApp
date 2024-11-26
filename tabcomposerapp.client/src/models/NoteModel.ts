import { Sound, Notation, IPause } from "./";

export enum NoteDuration {
    Whole = 1,
    Half = 1 / 2,
    Quarter = 1 / 4,
    Eighth = 1 / 8,
    Sixteenth = 1 / 16,
    Thirtytwo = 1 / 32
}

export enum NoteKind {
    Note,
    Pause
}

export interface INote extends IPause{
    readonly kind: NoteKind;
    readonly frequency: number,
    readonly notation: Notation,
    readonly octave: number,
    readonly fret: number;
    clone(): Note;
}

export class Note extends Sound implements INote {
    public readonly kind: NoteKind;
    public fret: number;
    public noteDuration: NoteDuration;
    private timeStamp: number;
    constructor(
        sound: Sound,
        fret: number,   
        noteDurationMs?: number,
        noteDuration?: NoteDuration,
    );
    constructor(
        frequency: number,
        notation: Notation,
        octave: number,
        fret: number,  
        noteDurationMs?: number,
        noteDuration?: NoteDuration,
    );
    constructor(
        frequencyOrSound: number | Sound,
        notationOrFret?: Notation | number,
        octave?: number,
        fret: number = 0,
        noteDurationMs: number = 500,
        noteDuration: NoteDuration = NoteDuration.Quarter,
    ) {
        if (frequencyOrSound instanceof Sound) { // Note(sound, fret)
            super(frequencyOrSound.frequency, frequencyOrSound.notation, frequencyOrSound.octave, noteDurationMs);
            this.fret = notationOrFret as number; 
            this.noteDuration = noteDuration;
            this.timeStamp = 0;
        } else {
            super(frequencyOrSound, notationOrFret as Notation, octave!, noteDurationMs);
            this.fret = fret;
            this.noteDuration = noteDuration;
            this.timeStamp = 0;
        }
        this.kind = NoteKind.Note;
    }

    public setTimeStampMs(timeStampMs: number): void {
        if (timeStampMs < 0) {
            throw new Error("Timestamp must be grater than 0.")
        }
        this.timeStamp = timeStampMs;
    }

    public clone(): Note {
        const note: Note = new Note(this, this.fret, this.getDurationMs(), this.noteDuration);
        note.setTimeStampMs(this.getTimeStampMs());
        return note;
    }

    public getTimeStampMs(): number { return this.timeStamp; }

    public getEndTimeStampMs(): number {return this.timeStamp + this.durationMs }
}


