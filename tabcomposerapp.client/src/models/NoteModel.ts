import { GuitarScale } from "../services";
import { Sound, Notation, IPause } from "./";

export enum Articulation {
    None,
    Slide,
    Legato,
    BendHalf,
    BendHalfReturn,
    BendFull,
    BendFullReturn
}
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
    readonly frequency: number,
    readonly notation: Notation,
    readonly octave: number,
    readonly fret: number;
    readonly articulation: Articulation;
    clone(): Note;
    setArticulation(articulation: Articulation): void;
}

export class Note extends Sound implements INote {
    public readonly kind: NoteKind;
    public fret: number;
    public noteDuration: NoteDuration;
    public articulation: Articulation;
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
            this.articulation = Articulation.None;
        } else {
            super(frequencyOrSound, notationOrFret as Notation, octave!, noteDurationMs);
            this.fret = fret;
            this.noteDuration = noteDuration;
            this.timeStamp = 0;
            this.articulation = Articulation.None
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
        console.log(this.noteDuration)

        const note: Note = GuitarScale.getNote(this.fret, this, this.getDurationMs(), this.noteDuration);
        note.setTimeStampMs(this.getTimeStampMs());
        note.articulation = this.articulation;
        return note;
    }

    public getTimeStampMs(): number { return this.timeStamp; }

    public getEndTimeStampMs(): number { return this.timeStamp + this.durationMs }

    public setArticulation(articulation: Articulation) {
        this.articulation = articulation;
    }

}


