import { NoteDuration, INote } from "./"

export interface IMeasure {
    readonly frets: number;
    readonly tempo: number;
    readonly numerator: number;
    readonly denominator: number;
    readonly measureDurationMs: number;
    putNote(fret: number, stringId: number, timeStamp: number, noteDuration?: NoteDuration): INote | undefined;
    pushNote(fret: number, stringId: number, noteDuration?: NoteDuration): INote | undefined;
    getNotes(stringId: number): INote[];
    forEach(callback: (notes: INote[], stringId: number,) => void): void;
    canPutNote(stringId: number, timeStamp: number, noteDuration: NoteDuration): boolean
    changeSignature(numerator: number, denominator: number): void;
    changeTempo(tempo: number): void;
    changeNoteTimeStamp(note: INote, stringId: number, timeStamp: number): boolean
    changeNoteFret(note: INote, stringId: number, fret: number): void
}