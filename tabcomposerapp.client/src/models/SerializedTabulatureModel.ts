import { Notation } from "./NotationModel";
import { NoteDuration, Articulation } from "./NoteModel";

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
    notes: Record<string, SerializedNote[]>;  // Mapowanie id struny na tablicê nut
}

export interface SerializedTabulature {
    title: string;
    author: string;
    frets: number;         // Zak³adam, ¿e frets to liczba
    tuning: SerializedTuning;  // Serializowane dane o strojeniu
    measures: SerializedMeasure[];  // Tablica serializowanych miar
    description: string;
}

export interface SerializedTuning {
    tuning: Record<number, { notation: Notation, octave: number }>
}
