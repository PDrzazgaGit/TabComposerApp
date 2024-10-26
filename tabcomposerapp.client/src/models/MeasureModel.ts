import { NoteDuration, Note } from "./"

export interface IMeasure {
    tempo: number
    numerator: number;   
    denominator: number;
    putNote(fret: number, string: number, noteDuration: NoteDuration,stringNoteIndex: number): boolean,
    putNoteWithTimeStamp(fret: number, string: number, timeStamp: number, noteDuration?: NoteDuration): boolean;
    pushNote(fret: number, string: number, noteDuration?: NoteDuration): boolean;
    getNotes(string: number): Note[];
    forEach(callback: (string: number, notes: (Note | boolean)[]) => void): void;
}