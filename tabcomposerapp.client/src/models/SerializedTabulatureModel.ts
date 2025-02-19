import { Notation } from "./";
import { Articulation, NoteDuration } from "./";

export interface SerializedNote {
    fret: number,
    timeStamp: number;
    noteDuration: NoteDuration,
    articulation: Articulation
}
export interface SerializedMeasure {
    tempo: number;
    numerator: number;
    denominator: number;
    notes: Record<string, SerializedNote[]>;  
}

export interface SerializedTabulature {
    title: string;
    author: string;
    frets: number;        
    tuning: SerializedTuning;  
    measures: SerializedMeasure[];  
    description: string;
}

export interface SerializedTuning {
    tuning: Record<number, { notation: Notation, octave: number }>
}
