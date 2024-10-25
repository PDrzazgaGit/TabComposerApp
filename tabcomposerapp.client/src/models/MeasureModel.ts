import { NoteDuration } from "./"

export interface IMeasure {
    tempo: number
    numerator: number;   
    denominator: number;
    putNote(fret: number, string: number, noteDuration?: NoteDuration): boolean;
}