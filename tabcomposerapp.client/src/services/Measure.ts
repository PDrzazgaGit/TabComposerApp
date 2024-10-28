import { Dictionary } from '../structures';
import { ITuning, Note, NoteDuration, Sound, IMeasure } from '../models';
import { GuitarScale } from '.';

const MINUTE_IN_MS: number = 60000;
export class Measure extends Dictionary<number, (Note | boolean)[]> implements IMeasure {
    private slotsPerMeasure: number;
    private slotDurationMs: number;

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

        this.slotsPerMeasure = (4 / this.denominator) * this.numerator * 8;

        this.slotDurationMs = (MINUTE_IN_MS / this.tempo) / (this.slotsPerMeasure / this.numerator);

        tuning.forEach((string) => {
            this.add(string, new Array<Note | boolean>(this.slotsPerMeasure).fill(true));
        });
    }

    public getNotes(string: number): Note[] {
        if (!this.hasString(string)) {
            throw new Error("String with number " + string + " is not exists.");
        }
        const stringSlots: (boolean | Note)[] = this.get(string)!;

        const notes: Note[] = stringSlots.filter(maybeNote => {
            return maybeNote instanceof Note; 
        });
        return notes;
    }

    private hasString(string: number): boolean {
        if (this.has(string)) return true;
        return false;
    }

    public override forEach(callback: (string: number, notes: (Note | boolean)[]) => void): void {
        super.forEach(callback);
    }

    private assembleNote(
        fret: number,
        string: number,
        noteDuration: NoteDuration = NoteDuration.Quarter
    ): Note {
        if (fret < 0 || fret > this.frets) {
            throw new Error("Fret must be between 0 and " + this.frets + ".");
        }
        if (!this.hasString(string)) {
            throw new Error("String with number " + string + " is not exists.");
        }
        const baseSound: Sound = this.tuning.getStringSound(string);
        const noteDurationMs = (60000 / this.tempo) * noteDuration;
       return GuitarScale.getNote(fret, baseSound, noteDurationMs, noteDuration);
    }

    public putNoteWithTimeStamp(
        fret: number,
        string: number,
        timeStamp: number,
        noteDuration: NoteDuration = NoteDuration.Quarter,
    ): boolean {
        const note: Note = this.assembleNote(fret, string, noteDuration);

        const stringSlots: (boolean | Note)[] | undefined = this.get(string);
        if (!stringSlots) return false

        const slotsNeeded = this.slotsPerMeasure * note.noteDuration;

        const slotIndex = Math.floor(timeStamp / this.slotDurationMs);

        if (slotIndex >= 0 && slotIndex <= stringSlots.length - slotsNeeded) {
            const isSpaceAvailable = stringSlots.slice(slotIndex, slotIndex + slotsNeeded).every(slot => slot === true);

            if (isSpaceAvailable) {
                note.setTimeStampMs(timeStamp);

                stringSlots[slotIndex] = note;
                for (let j = 1; j < slotsNeeded; j++) {
                    stringSlots[slotIndex + j] = false;
                }
                return true; //ok
            }
            return false; //no space
        }
        return false; //index somewhere in space xd
    }

    public putNote(
        fret: number,
        string: number,
        noteDuration: NoteDuration = NoteDuration.Quarter,
        stringNoteIndex: number
    ): boolean {
        // Sprawdzamy, czy index jest w granicach
        if (stringNoteIndex >= this.slotsPerMeasure || stringNoteIndex < 0) {
            throw new Error("String note index must be between 0 and " + (this.slotsPerMeasure - 1) + ".");
        }

        // Tworzymy nutê
        const note: Note = this.assembleNote(fret, string, noteDuration);
        const stringSlots = this.get(string); // Pobieramy sloty dla danej struny

        if (!stringSlots) return false; // Jeœli sloty nie istniej¹, zwracamy false

        const slotsNeeded = this.slotsPerMeasure * note.noteDuration; // Obliczamy potrzebne sloty

        // Sprawdzamy, czy w podanym indeksie jest miejsce na nutê
        if (stringNoteIndex + slotsNeeded <= stringSlots.length) {
            const isSpaceAvailable = stringSlots.slice(stringNoteIndex, stringNoteIndex + slotsNeeded).every(slot => slot === true);

            if (isSpaceAvailable) {
                const timestampMs = stringNoteIndex * this.slotDurationMs; // Obliczamy timestamp
                note.setTimeStampMs(timestampMs); // Ustawiamy timestamp dla nuty

                stringSlots[stringNoteIndex] = note; // Wstawiamy nutê w okreœlony slot
                for (let j = 1; j < slotsNeeded; j++) {
                    stringSlots[stringNoteIndex + j] = false; // Oznaczamy kolejne sloty jako zajête
                }
                return true; // Sukces
            }
        }

        return false; // Brak miejsca
    }

    public pushNote(
        fret: number,
        string: number,
        noteDuration: NoteDuration = NoteDuration.Quarter
    ) : boolean {
        const note: Note = this.assembleNote(fret, string, noteDuration);

        const stringSlots: (boolean | Note)[] | undefined = this.get(string);
        if (!stringSlots) return false

        const slotsNeeded = this.slotsPerMeasure * note.noteDuration;

        for (let i = 0; i <= stringSlots.length - slotsNeeded; i++) {
            const isSpaceAvailable = stringSlots.slice(i, i + slotsNeeded).every(slot => slot === true);

            if (isSpaceAvailable) {

                const timestampMs = i * this.slotDurationMs;
                note.setTimeStampMs(timestampMs);

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
