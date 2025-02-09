import { MusicScale } from "./";
import { Note, NoteDuration, Sound, Notation, ITuning } from "./../models";

export class GuitarScale extends MusicScale {

    public static getNote(fret: number, base: Sound, noteDurationMs?: number, noteDuration?: NoteDuration): Note {
        if (fret < 0) {
            throw new Error("Fret cannot be less than zero.");
        }
       
        let notation: Notation = base.notation;
        let octave: number = base.octave;
        let frequency: number = base.frequency;

        if (fret > 0) {
            // Dodaj przesuniêcie progów do notacji
            const totalSteps = notation + fret;

            // Oblicz now¹ notacjê i oktawê
            notation = totalSteps % 12; // Ustal nutê w ramach oktawy
            octave += Math.floor(totalSteps / 12); // Zwiêksz oktawê, jeœli przekroczyliœmy granicê

            // Oblicz czêstotliwoœæ dla nowej nuty i oktawy
            frequency = this.calculateFrequency(notation, octave);
        }

        return new Note(frequency, notation, octave, fret, noteDurationMs, noteDuration);
    }
}