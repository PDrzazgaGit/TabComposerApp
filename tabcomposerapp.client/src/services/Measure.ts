import { ITuning, Note, NoteDuration, Sound, IMeasure, Pause } from '../models';
import { GuitarScale } from '.';

const MINUTE_IN_MS: number = 60000;

export class MeasureService extends Map<number, (Note | Pause)[]> implements IMeasure {

    public measureDurationMs: number;
    private wholeNoteDurationMs: number;

    constructor(
        public tempo: number,
        public numerator: number,
        public denominator: number,
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

        this.measureDurationMs = this.calculateMeasureDurationMs();
        this.wholeNoteDurationMs = this.calculateWholeNoteDurationMs();

        tuning.forEach((stringId: number) => {
            this.set(Number(stringId), new Array<Note>());     
        });
    }

    private assembleNote(
        fret: number,
        stringId: number,
        noteDuration: NoteDuration = NoteDuration.Quarter
    ): Note {
        if (fret < 0 || fret > this.frets) {
            throw new Error("Fret must be between 0 and " + this.frets + ".");
        }
        if (!this.hasString(stringId)) {
            throw new Error("String with number " + stringId + " does not exist.");
        }
        const baseSound: Sound = this.tuning.getStringSound(stringId);

        const noteDurationMs = this.calculateNoteDurationMs(noteDuration); // U¿ycie wartoœci enum

        return GuitarScale.getNote(fret, baseSound, noteDurationMs, noteDuration);
    }

    private isWithinMeasure(timeStamp: number, noteDurationMs: number): boolean {
        return (timeStamp + noteDurationMs) <= this.measureDurationMs;
    }

    private hasString(stringId: number): boolean {
        return this.has(stringId); // tutaj zawsze false
    }

    private calculateNoteDurationMs(noteDuration: NoteDuration): number {
        return this.wholeNoteDurationMs * noteDuration;
    }

    private calculateMeasureDurationMs(): number {
        return (MINUTE_IN_MS / this.tempo) * (this.numerator * (4 / this.denominator));
    }

    private calculateWholeNoteDurationMs(): number {
        return (MINUTE_IN_MS / this.tempo) * 4; // Ca³a nuta trwa 4 æwierænuty
    }

    public changeNoteTimeStamp(note: Note, stringId: number ,timeStamp: number): boolean {
        if (timeStamp < 0) {
            throw new Error("Timestamp must be grater than 0.");
        }
        if (!this.hasString(stringId)) {
            throw new Error("String with number " + stringId + " does not exist.");
        }
        const stringNotes: Note[] = this.get(stringId)!
        const foundNote = stringNotes.find(n => n === note);

        if (foundNote) {
            if (!this.canPutNote(stringNotes, timeStamp, foundNote.noteDuration)) {
                return false;
            }
            foundNote.setTimeStampMs(timeStamp);
            return true;
        }
        return false;
    }

    public changeNoteFret(note: Note, stringId: number, fret: number): void {
        if (!this.hasString(stringId)) {
            throw new Error("String with number " + stringId + " does not exist.");
        }
        const stringNotes: Note[] = this.get(stringId)!;
        const foundNote = stringNotes.find(n => n === note);
        if (foundNote) {
            note = this.assembleNote(fret, stringId, foundNote.noteDuration);
            foundNote.fret = fret;
            foundNote.frequency = note.frequency;
            foundNote.notation = note.notation;
            foundNote.octave = note.octave;
        }
    }

    public changeSignature(numerator: number, denominator: number): void {
        if (numerator <= 0) {
            throw new Error("Numerator must be a positive integer.");
        }
        if (denominator <= 0) {
            throw new Error("Denominator must be a positive integer.");
        }
        this.numerator = numerator;
        this.denominator = denominator;
        this.measureDurationMs = this.calculateMeasureDurationMs();

        this.forEach((notes, string) => {
            const filteredNotes = notes.filter(note => {
                return this.isWithinMeasure(note.getTimeStampMs(), note.getDurationMs());
            });

            if(notes.length != filteredNotes.length)
                this.set(string, filteredNotes);
        });
    }

    public changeTempo(tempo: number): void {
        if (tempo <= 0) {
            throw new Error("Tempo must be a positive integer.");
        }

        const tempoRatio = this.tempo / tempo;

        this.tempo = tempo;
        this.measureDurationMs = this.calculateMeasureDurationMs();
        this.wholeNoteDurationMs = this.calculateWholeNoteDurationMs();
        this.forEach((notes) => {
            notes.forEach(note => {
                const timeStamp = note.getTimeStampMs();
                const durationMs = note.getDurationMs();
                note.setTimeStampMs(timeStamp * tempoRatio);
                note.setDurationMs(durationMs * tempoRatio);
            });
        });
    }

    public getNotes(stringId: number): Note[] {
        if (!this.hasString(stringId)) {
            throw new Error("String with number " + stringId + " does not exist.");
        }
        return this.get(stringId)!;
    }

    public canPutNote(stringId: number | Note[], timeStamp: number, noteDuration: NoteDuration): boolean {

        if (timeStamp < 0) {
            throw new Error("Timestamp must be grater than 0.");
        }

        const noteDurationMs = this.calculateNoteDurationMs(noteDuration);
        const endTimestamp = timeStamp + noteDurationMs;

        if (!this.isWithinMeasure(timeStamp, noteDurationMs)) {
            return false; // Nutka przekracza d³ugoœæ metrum
        }

        const hasCollision = (notes: Note[]): boolean => {
            return notes.some(existingNote => {
                const existingStart = existingNote.getTimeStampMs();
                const existingEnd = existingStart + existingNote.getDurationMs();
                return timeStamp < existingEnd && endTimestamp > existingStart;
            });
        };

        if (Array.isArray(stringId)) {
            return !hasCollision(stringId);
        } else {
            const stringNotes = this.get(stringId);
            if (!stringNotes) return false;

            return !hasCollision(stringNotes);
        }
    }

    public putNote(
        fret: number,
        stringId: number,
        timeStamp: number,
        noteDuration: NoteDuration = NoteDuration.Quarter,
    ): Note | undefined {

        if (timeStamp < 0) {
            throw new Error("Timestamp must be grater than 0.");
        }

        const note: Note = this.assembleNote(fret, stringId, noteDuration);
        const stringNotes = this.get(stringId);

        if (!stringNotes) return undefined;

        const canPutNote: boolean = this.canPutNote(stringNotes, timeStamp, noteDuration);
       
        if (!canPutNote) {
            return undefined;
        }
        note.setTimeStampMs(timeStamp);
        stringNotes.push(note);
        return note;
    }
    
    public pushNote(
        fret: number,
        stringId: number,
        noteDuration: NoteDuration = NoteDuration.Quarter
    ): Note | undefined {
        const note = this.assembleNote(fret, stringId, noteDuration);
        const stringNotes = this.get(stringId);

        if (!stringNotes) return undefined;

        const lastNote = stringNotes[stringNotes.length - 1];
        const timeStamp = lastNote ? lastNote.getTimeStampMs() + lastNote.getDurationMs() : 0;

        const canPutNote: boolean = this.canPutNote(stringNotes, timeStamp, noteDuration);

        if (!canPutNote) {
            return undefined;
        }
        note.setTimeStampMs(timeStamp);
        stringNotes.push(note);
        return note;
    }

    public putPause(stringId: number, timeStamp: number, noteDuration: NoteDuration = NoteDuration.Quarter) {
        if (timeStamp < 0) {
            throw new Error("Timestamp must be grater than 0.");
        }
        const pause = new Pause(noteDuration);
        const pauseDurationMs = this.calculateNoteDurationMs(noteDuration);
        pause.setDurationMs(pauseDurationMs);

        const stringNotes = this.get(stringId);

        if (!stringNotes) return undefined;

        const canPutNote: boolean = this.canPutNote(stringNotes, timeStamp, noteDuration);

        if (!canPutNote) {
            return undefined;
        }
        pause.setTimeStampMs(timeStamp);
        stringNotes.push(pause);
        return pause;
    }

    public pushPause(stringId: number, noteDuration: NoteDuration = NoteDuration.Quarter): Pause | undefined {
        const stringNotes = this.get(stringId);
        if (!stringNotes) return undefined;

        const pause = new Pause(noteDuration);
        const pauseDurationMs = this.calculateNoteDurationMs(noteDuration); // U¿ycie wartoœci enum
        pause.setDurationMs(pauseDurationMs);

        const lastNote = stringNotes[stringNotes.length - 1];
        const timeStamp = lastNote ? lastNote.getTimeStampMs() + lastNote.getDurationMs() : 0;

        const canPutNote: boolean = this.canPutNote(stringNotes, timeStamp, noteDuration);

        if (!canPutNote) {
            return undefined;
        }
        pause.setTimeStampMs(timeStamp);
        stringNotes.push(pause);
        return pause;
    }
}
