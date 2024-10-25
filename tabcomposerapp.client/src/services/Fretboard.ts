import { Dictionary } from './../structures';
import { ITuning, Note, NoteDuration, Sound, IMeasure } from './../models';
import { GuitarScale } from './';

export class Fretboard extends Dictionary<number, (Note | boolean)[]> implements IMeasure {
    private slotsPerMeasure: number;

    constructor(
        public readonly tempo: number,
        public readonly numerator: number,
        public readonly denominator: number,
        private readonly tuning: ITuning,
        public readonly frets: number = 24
    ) {
        if (tempo <= 0) {
            throw new Error("Tempo must be a positive integer.");
        }
        if (numerator <= 0) {
            throw new Error("Numerator must be a positive integer.");
        }
        if (denominator <= 0) {
            throw new Error("Denominator must be a positive integer.");
        }

        super();

       // const smallestNoteDuration: number = NoteDuration.Thirtytwo;

        this.slotsPerMeasure = (4 / this.denominator) * this.numerator * 8;

        tuning.forEach((string) => {
            this.add(string, new Array<Note | boolean>(this.slotsPerMeasure).fill(true));
        });
    }

    public putNote(
        fret: number,
        string: number,
        noteDuration: NoteDuration = NoteDuration.Quarter
    ): boolean {
        if (fret < 0 || fret > this.frets) {
            throw new Error("Fret must be between 0 and " + this.frets + ".");
        }

        const baseSound: Sound = this.tuning.getStringSound(string);
        const noteDurationMs = (60000 / this.tempo) * noteDuration;
        const note: Note = GuitarScale.getNote(fret, baseSound, noteDurationMs, noteDuration);

        return this.addNoteToSlot(string, note);
    }

    /*

     przyk³ad: pierwsza nuta to szesnastka (zak³adamy, ¿e tablica podzielona na this.slotsPerMeasure = 16 kawa³ków), druga to czwórka, trzecia to ósemka, czwarta to czwórka.: note, true, true, true, note, false, false, false, note, false, true, true, note, false, false, false. 

    */

    private addNoteToSlot(stringIndex: number, note: Note): boolean {
        

        const stringSlots = this.get(stringIndex);
        if (!stringSlots) return false;

        const slotsNeeded = this.slotsPerMeasure * note.noteDuration;

        for (let i = 0; i <= stringSlots.length - slotsNeeded; i++) {
            const isSpaceAvailable = stringSlots.slice(i, i + slotsNeeded).every(slot => slot === true);

            if (isSpaceAvailable) {

                stringSlots[i] = note;
                for (let j = 1; j < slotsNeeded; j++) {
                    stringSlots[i + j] = false;
                }
                return true;
            }
        }
        return false; 
    }
}