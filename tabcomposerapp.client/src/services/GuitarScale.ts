import { MusicScale } from "./";
import { Note, NoteDuration, Sound, Notation, ITuning } from "./../models";
import { Dictionary } from "./../structures";

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

    /* Do doprecyzowania */
    public static findCorrespondingNotes(reference: Sound, tuning: ITuning, frets: number = 24): Dictionary<number, Note> {
        const notes: Dictionary<number, Note> = new Dictionary();
        tuning.forEach((string, base) => {
            const note: Note | null = this?.findNoteOnString(base, reference, frets)
            if (note) {
                notes.add(string, note);
            }
        });
        return notes;
    }
    /* Do doprecyzowania */
    private static findNoteOnString(base: Sound, reference: Sound, frets: number = 24): Note | null {
        const baseNotation: Notation = base.notation;
        const baseOctave: number = base.octave;
        const refNotation: Notation = reference.notation;
        const refOctave: number = reference.octave;

        const octaveDifference = (refOctave - baseOctave) * 12; 
        const notationDifference = refNotation - baseNotation; 

        const semitoneDifference = octaveDifference + notationDifference;

        if (semitoneDifference < 0 || semitoneDifference > frets) {
            return null;
        }

        return new Note(reference, semitoneDifference);
    }
}