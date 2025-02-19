import { action, makeObservable, observable } from "mobx";
import { IPause, Notation, Sound } from "./";

export enum Articulation {
    None,
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
    slide: boolean;
    overflow: boolean;
    clone(): Note;
    setArticulation(articulation: Articulation): void;
}

export class Note extends Sound implements INote {
    public readonly kind: NoteKind;
    public slide: boolean;
    public overflow: boolean;
    public fret: number;
    public noteDuration: NoteDuration;
    public articulation: Articulation;
    private timeStamp: number;
    public playing: boolean;
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
        this.slide = false;
        this.overflow = true;
        this.playing = false;
        makeObservable(this, {
            kind: observable,
            slide: observable,
            overflow: observable,
            fret: observable,
            noteDuration: observable,
            articulation: observable,
            playing: observable,
            //timeStamp: observable,

            // Akcje
            setTimeStampMs: action,
            setArticulation: action,

            getTimeStampMs: action,
            getEndTimeStampMs: action,

            // Metody
            clone: action,
        });
    }

    public setTimeStampMs(timeStampMs: number): void {
        if (timeStampMs < 0) {
            throw new Error("Timestamp must be grater than 0.")
        }
        this.timeStamp = timeStampMs;
    }

    public clone(): Note {
        const note: Note = new Note(this.frequency, this.notation, this.octave, this.fret , this.getDurationMs(), this.noteDuration);//GuitarScale.getNote(this.fret, this, this.getDurationMs(), this.noteDuration);
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


