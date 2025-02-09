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
            // Dodaj przesuni�cie prog�w do notacji
            const totalSteps = notation + fret;

            // Oblicz now� notacj� i oktaw�
            notation = totalSteps % 12; // Ustal nut� w ramach oktawy
            octave += Math.floor(totalSteps / 12); // Zwi�ksz oktaw�, je�li przekroczyli�my granic�

            // Oblicz cz�stotliwo�� dla nowej nuty i oktawy
            frequency = this.calculateFrequency(notation, octave);
        }

        return new Note(frequency, notation, octave, fret, noteDurationMs, noteDuration);
    }
}