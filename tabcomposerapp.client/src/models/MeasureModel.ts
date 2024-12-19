import { NoteDuration, INote, IPause, Articulation } from "./"

export interface IMeasure {
    readonly frets: number;
    readonly tempo: number;
    readonly numerator: number;
    readonly denominator: number;
    readonly measureDurationMs: number;
    deepClone(): IMeasure;
    putNote(fret: number, stringId: number, timeStamp: number, noteDuration?: NoteDuration): INote | undefined;
    pushNote(fret: number, stringId: number, noteDuration?: NoteDuration): INote | undefined;
    getNotes(stringId: number): INote[];
    forEach(callback: (notes: INote[], stringId: number,) => void): void;
    canPutNote(stringId: number, timeStamp: number, noteDuration: NoteDuration): boolean
    changeSignature(numerator: number, denominator: number): boolean;
    changeTempo(tempo: number): void;
    changeNoteTimeStamp(note: INote, stringId: number, timeStamp: number): boolean
    changeNoteFret(note: INote, stringId: number, fret: number): void
    changeNoteDuration(note: INote | IPause, newDuration: NoteDuration, stringId: number): boolean;
    pushPause(stringId: number, noteDuration: NoteDuration): IPause | undefined;
    putPause(stringId: number, timeStamp: number, noteDuration: NoteDuration): IPause | undefined;
    deleteNote(note: INote | IPause, stringId: number, shift:boolean): void;
    clone(): IMeasure;
    moveNoteRight(note: INote | IPause, stringId: number, interval?: NoteDuration): boolean;
    moveNoteLeft(note: INote | IPause, stringId: number, interval?: NoteDuration): boolean;
    canPushNote(stringId: number, noteDuration: NoteDuration): boolean;
    changeArticulation(note: INote, stringId: number, articulation: Articulation): void;
}