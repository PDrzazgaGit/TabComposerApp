import { MusicScale } from "./";
import { Note, Sound, Notation } from "./../models";

export class GuitarScale extends MusicScale {
    public static getNote(stringBaseSound: Sound, fret: number): Note {
        if (fret < 0) {
            throw new Error("Fret cannot be less than zero.");
        }
        let notation: Notation = stringBaseSound.notation;
        let octave: number = stringBaseSound.octave;
        if (fret > 0) {
            notation = ((notation + fret) % 12);
            octave += (fret / 12) | 0;       
        }
        const frequency: number = this.calculateFrequency(notation, octave);
        return new Note(frequency, notation, octave, fret);
    }
}