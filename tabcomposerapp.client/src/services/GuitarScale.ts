import { MusicScale } from "./";
import { Notation, Note, NoteDuration, Sound } from "./../models";

export class GuitarScale extends MusicScale {

    public static getNote(fret: number, base: Sound, noteDurationMs?: number, noteDuration?: NoteDuration): Note {
        if (fret < 0) {
            throw new Error("Fret cannot be less than zero.");
        }
       
        let notation: Notation = base.notation;
        let octave: number = base.octave;
        let frequency: number = base.frequency;

        if (fret > 0) {
            const totalSteps = notation + fret;

            notation = totalSteps % 12; 
            octave += Math.floor(totalSteps / 12); 

            frequency = this.calculateFrequency(notation, octave);
        }

        return new Note(frequency, notation, octave, fret, noteDurationMs, noteDuration);
    }
}