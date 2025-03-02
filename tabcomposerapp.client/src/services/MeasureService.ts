import { makeAutoObservable } from 'mobx';
import { GuitarScale } from '.';
import { Articulation, IMeasure, ITuning, Note, NoteDuration, NoteKind, Pause, Sound } from '../models';

const MINUTE_IN_MS: number = 60000;


export class MeasureService implements IMeasure {

    public measureDurationMs: number;
    private wholeNoteDurationMs: number;
    private strings: Map<number, (Note | Pause)[]>;
    constructor(
        public tempo: number,
        public numerator: number,
        public denominator: number,
        private readonly tuning: ITuning,
        public readonly frets: number = 24
    )
    {
        if (tempo <= 0) {
            throw new Error("Tempo must be a positive integer.");
        }
        if (numerator <= 0) {
            throw new Error("Numerator must be a positive integer.");
        }
        if (denominator <= 0) {
            throw new Error("Denominator must be a positive integer.");
        }

        this.measureDurationMs = this.calculateMeasureDurationMs(this.tempo, this.numerator, this.denominator);
        this.wholeNoteDurationMs = this.calculateWholeNoteDurationMs();
        this.strings = new Map<number, (Note | Pause)[]>();

        tuning.forEach((stringId: number) => {
            this.strings.set(Number(stringId), new Array<Note>());     
        });
        makeAutoObservable(this);
    }

    public clone(): MeasureService {
        const measure: MeasureService = new MeasureService(this.tempo, this.numerator, this.denominator, this.tuning, this.frets);
        this.strings.forEach((notes, stringId) => {
            measure.strings.set(Number(stringId), notes);
        })
        return measure;
    }

    public forEach(callback: (notes: Note[], stringId: number,) => void): void {
        this.strings.forEach(callback);
    }

    public deepClone(): MeasureService {
        const measure: MeasureService = new MeasureService(this.tempo, this.numerator, this.denominator, this.tuning, this.frets);
        this.strings.forEach((notes, stringId) => {
            const clonedNotes: (Note | Pause)[] = [];
            notes.forEach(note => {
                const clonedNote = note.clone();
                clonedNotes.push(clonedNote);
            })
            measure.strings.set(Number(stringId), clonedNotes);
        })
        return measure;
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

        const noteDurationMs = this.calculateNoteDurationMs(noteDuration); // U�ycie warto�ci enum

        return GuitarScale.getNote(fret, baseSound, noteDurationMs, noteDuration);
    }

    public map(callback: (notes: (Note | Pause)[], stringId: number) => void): void {
        this.strings.forEach((notes, stringId) => {
            callback(notes, stringId);
        });
    }

    private isWithinMeasure(timeStamp: number, noteDurationMs: number): boolean {
        return (Math.floor(timeStamp + noteDurationMs)) <= this.measureDurationMs;
    }

    private hasString(stringId: number): boolean {
        return this.strings.has(stringId); 
    }

    private calculateNoteDurationMs(noteDuration: NoteDuration): number {
        return this.wholeNoteDurationMs * noteDuration;
    }

    private calculateMeasureDurationMs(tempo: number, numerator: number, denominator: number): number {
        return (MINUTE_IN_MS / tempo) * (numerator * (4 / denominator));
    }

    private calculateWholeNoteDurationMs(): number {
        return (MINUTE_IN_MS / this.tempo) * 4; // Ca�a nuta trwa 4 �wier�nuty
    }

    public changeNoteTimeStamp(note: Note, stringId: number ,timeStamp: number): boolean {
        if (timeStamp < 0) {
            throw new Error("Timestamp must be grater than 0.");
        }
        if (!this.hasString(stringId)) {
            throw new Error("String with number " + stringId + " does not exist.");
        }
        const stringNotes: Note[] = this.strings.get(stringId)!
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
        const stringNotes: Note[] = this.strings.get(stringId)!;
        const foundNote = stringNotes.find(n => n === note);
        if (foundNote) {
            note = this.assembleNote(fret, stringId, foundNote.noteDuration);
            foundNote.fret = fret;
            foundNote.frequency = note.frequency;
            foundNote.notation = note.notation;
            foundNote.octave = note.octave;
        }
    }

    public changeNoteDuration(
        note: Note | Pause,
        newDuration: NoteDuration,
        stringId: number
    ): boolean {
        const stringNotes: Note[] = this.strings.get(stringId)!;
        const foundNote = stringNotes.find(n => n === note);
        if (foundNote) {
            const newDurationMs: number = this.calculateNoteDurationMs(newDuration);
            const noteIndex: number = stringNotes.indexOf(foundNote);
            const oldDurationMs = foundNote.getDurationMs();

            if (!this.isWithinMeasure(foundNote.getTimeStampMs(), newDurationMs)) {
                return false;
            }

            if (noteIndex === stringNotes.length - 1) {
                foundNote.noteDuration = newDuration;
                foundNote.setDurationMs(newDurationMs);
                return true;
            } else {
                const timeDiff: number = Math.abs(oldDurationMs - newDurationMs);
                if (newDurationMs < oldDurationMs) { // shorten note
                    foundNote.noteDuration = newDuration;
                    foundNote.setDurationMs(newDurationMs);
                    for (let i = noteIndex + 1; i < stringNotes.length; i++) {
                        stringNotes[i].setTimeStampMs(stringNotes[i].getTimeStampMs() - timeDiff);
                    }
                    return true;
                } else {                // make note longer
                    let canFit = true;
                    for (let i = noteIndex + 1; i < stringNotes.length; i++) {
                        const newStartTime = stringNotes[i].getTimeStampMs() + timeDiff;
                        if (Math.floor(newStartTime + stringNotes[i].getDurationMs()) > this.measureDurationMs) {
                            canFit = false;
                            break;
                        }
                    }
                    if (canFit) {

                        foundNote.noteDuration = newDuration;
                        foundNote.setDurationMs(newDurationMs);

                        for (let i = noteIndex + 1; i < stringNotes.length; i++) {
                            stringNotes[i].setTimeStampMs(stringNotes[i].getTimeStampMs() + timeDiff);
                        }

                        return true;
                    } else {
                        return false; // cant fit
                    }
                }
            }
        }
        return false;
    }

    public deleteNote(note: Note | Pause, stringId: number, shift: boolean) {
        const stringNotes = this.strings.get(stringId);
        if (!stringNotes) {
            throw new Error("String with number " + stringId + " does not exist.");
        }
        const index = stringNotes.findIndex(item => item === note);

        if (index === -1) {
            throw new Error("Note does not exist.");
        }

        
        if (shift && (index != stringNotes.length - 1)) { // check if last, if not shift
            const durationToShift = note.getDurationMs();
            for (let i = index + 1; i < stringNotes.length; i++) {
                stringNotes[i].setTimeStampMs(stringNotes[i].getTimeStampMs() - durationToShift);
            }
        }
        
        stringNotes.splice(index, 1);
        this.strings.set(Number(stringId), stringNotes);
    }

    public moveNoteRight(note: Note | Pause, stringId: number, jump: boolean, interval: NoteDuration = note.noteDuration): boolean {
        const stringNotes = this.strings.get(stringId);
        if (!stringNotes) {
            throw new Error("String with number " + stringId + " does not exist.");
        }

        const index = stringNotes.findIndex(item => item === note);
        if (index === -1) {
            throw new Error("Note does not exist.");
        }

        const intervalMs = this.calculateNoteDurationMs(interval);
        let newStartTime = note.getTimeStampMs() + intervalMs;

        if (Math.floor(newStartTime + note.getDurationMs()) > this.measureDurationMs) {
            return false;
        }

        if (index !== stringNotes.length - 1) {

            const newEndTime = note.getEndTimeStampMs() + intervalMs;

            const isCollision = stringNotes.some((otherNote, i) => {
                if (i !== index) {

                    const otherNoteEnd = otherNote.getEndTimeStampMs();
                    const otherNoteStart = otherNote.getTimeStampMs();

                    return (
                        (newStartTime < otherNoteEnd && newEndTime > otherNoteStart) || // Nak�adanie si�
                        (newStartTime >= otherNoteStart && newEndTime <= otherNoteEnd) || // Zawieranie si� w innej nucie
                        (newStartTime <= otherNoteStart && newEndTime >= otherNoteEnd)    // Ca�kowite obejmowanie innej nuty
                    );
                }
                return false;
            });

            if (isCollision) {
                if (!jump)
                    return false;
                const rightNote = stringNotes[index + 1];

                if (rightNote.getDurationMs() === note.getDurationMs()) {
                    newStartTime = rightNote.getTimeStampMs();
                    rightNote.setTimeStampMs(note.getTimeStampMs());
                } else {
                    newStartTime = note.getTimeStampMs() + rightNote.getDurationMs();
                    rightNote.setTimeStampMs(note.getTimeStampMs());
                }

                stringNotes[index + 1] = note;
                stringNotes[index] = rightNote;
            }
        }
        note.setTimeStampMs(newStartTime);
        return true;
    }

    public moveNoteLeft(note: Note | Pause, stringId: number, jump: boolean ,interval: NoteDuration = note.noteDuration): boolean {
        const stringNotes = this.strings.get(stringId);
        if (!stringNotes) {
            throw new Error("String with number " + stringId + " does not exist.");
        }

        const index = stringNotes.findIndex(item => item === note);
        if (index === -1) {
            throw new Error("Note does not exist.");
        }

        const intervalMs = this.calculateNoteDurationMs(interval);
        let newStartTime = note.getTimeStampMs() - intervalMs;
        if (newStartTime < 0) {
            return false;
        }

        if (index !== 0) {
            
            const newEndTime = note.getEndTimeStampMs() - intervalMs;
            const isCollision = stringNotes.some((otherNote, i) => {

                if (i !== index) {
                    const otherNoteEnd = otherNote.getEndTimeStampMs();
                    const otherNoteStart = otherNote.getTimeStampMs();
                    return (
                        (newStartTime < otherNoteEnd && newEndTime > otherNoteStart) || // Nak�adanie si�
                        (newStartTime >= otherNoteStart && newEndTime <= otherNoteEnd) || // Zawieranie si� w innej nucie
                        (newStartTime <= otherNoteStart && newEndTime >= otherNoteEnd)    // Ca�kowite obejmowanie innej nuty
                    );
                }
                return false;
            });

            if (isCollision) {
                if (!jump)
                    return false;
                const leftNote = stringNotes[index - 1];

                if (leftNote.getDurationMs() === note.getDurationMs()) {
                    newStartTime = leftNote.getTimeStampMs();
                    leftNote.setTimeStampMs(note.getTimeStampMs());                    
                } else {
                    newStartTime = leftNote.getTimeStampMs();
                    leftNote.setTimeStampMs(newStartTime + note.getDurationMs());
                }

                stringNotes[index - 1] = note;
                stringNotes[index] = leftNote;
            }
        }
        note.setTimeStampMs(newStartTime);
        return true;
    }

    public changeSignature(numerator: number, denominator: number): boolean {
        if (numerator <= 0) {
            throw new Error("Numerator must be a positive integer.");
        }
        if (denominator <= 0) {
            throw new Error("Denominator must be a positive integer.");
        }

        const newMeasureDurationMs = this.calculateMeasureDurationMs(this.tempo, numerator, denominator);

        let noteLoss:boolean = false;

        this.strings.forEach((notes) => {
            const filteredNotes = notes.filter(note => {
                return (Math.floor(note.getTimeStampMs() + note.getDurationMs())) <= newMeasureDurationMs;
            });

            if (notes.length != filteredNotes.length) {
                noteLoss = true;
            }
            
                
        });
        if (noteLoss) {
            return false;
        }
        this.numerator = numerator;
        this.denominator = denominator;
        this.measureDurationMs = newMeasureDurationMs;

        return true;
    }

 
    public changeTempo(tempo: number): void {
        if (tempo <= 0) {
            throw new Error("Tempo must be a positive integer.");
        }

        const oldMeasureDuration = this.measureDurationMs;

        this.tempo = tempo;
        this.measureDurationMs = this.calculateMeasureDurationMs(this.tempo, this.numerator, this.denominator);
        this.wholeNoteDurationMs = this.calculateWholeNoteDurationMs();

        const timeScale = this.measureDurationMs / oldMeasureDuration;

        this.strings.forEach((notes, stringId) => {

            const notesData = notes.map(note => {
                return {
                    fret: note.fret,
                    noteDuration: note.noteDuration,
                    kind: note.kind,
                    articulation: note.articulation,
                    timeStamp: note.getTimeStampMs()
                };
            });
            this.strings.set(Number(stringId), []);
            notesData.forEach(note => {
                if (note.kind === NoteKind.Note) {
                    const noteToMove = this.pushNote(note.fret, stringId, note.noteDuration);
                    if (noteToMove) {
                        noteToMove.setArticulation(note.articulation);
                        noteToMove.setTimeStampMs(note.timeStamp * timeScale)
                    }

                } else {
                    const pauseToMove = this.pushPause(stringId, note.noteDuration);
                    if (pauseToMove) {
                        pauseToMove.setTimeStampMs(note.timeStamp * timeScale)
                    }

                }
                    
            })
        });
    }

    public getNotes(stringId: number): Note[] {
        if (!this.hasString(stringId)) {
            throw new Error("String with number " + stringId + " does not exist.");
        }
        return this.strings.get(stringId)!;
    }

    public canPutNote(stringId: number | Note[], timeStamp: number, noteDuration: NoteDuration): boolean {

        if (timeStamp < 0) {
            throw new Error("Timestamp must be grater than 0.");
        }

        const noteDurationMs = this.calculateNoteDurationMs(noteDuration)
        const endTimestamp = timeStamp + noteDurationMs;

        if (!this.isWithinMeasure(timeStamp, noteDurationMs)) {
            return false; // Nutka przekracza d�ugo�� metrum
        }

        const hasCollision = (notes: Note[]): boolean => {
            return notes.some(existingNote => {
                const existingStart = existingNote.getTimeStampMs();
                const existingEnd = existingStart + existingNote.getDurationMs();
                return timeStamp < Math.floor(existingEnd) && endTimestamp > Math.floor(existingStart);
            });
        };


        if (Array.isArray(stringId)) {
            return !hasCollision(stringId);
        } else {
            const stringNotes = this.strings.get(stringId);
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
        const stringNotes = this.strings.get(stringId);

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
        const stringNotes = this.strings.get(stringId);

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

    public canPushNote(stringId: number, noteDuration: NoteDuration): boolean {
        const stringNotes = this.strings.get(stringId);

        if (!stringNotes) {
            throw new Error("String with number " + stringId + " does not exist.");
        }

        const lastNote = stringNotes[stringNotes.length - 1];
        const timeStamp = lastNote ? lastNote.getTimeStampMs() + lastNote.getDurationMs() : 0;
        return this.canPutNote(stringNotes, timeStamp, noteDuration);;
    }

    public putPause(stringId: number, timeStamp: number, noteDuration: NoteDuration = NoteDuration.Quarter) {
        if (timeStamp < 0) {
            throw new Error("Timestamp must be grater than 0.");
        }
        const pause = new Pause(noteDuration);
        const pauseDurationMs = this.calculateNoteDurationMs(noteDuration);
        pause.setDurationMs(pauseDurationMs);

        const stringNotes = this.strings.get(stringId);

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
        const stringNotes = this.strings.get(stringId);
        if (!stringNotes) return undefined;

        const pause = new Pause(noteDuration);
        const pauseDurationMs = this.calculateNoteDurationMs(noteDuration); // U�ycie warto�ci enum
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

    public changeArticulation(note: Note, stringId: number, articulation: Articulation) {
        const stringNotes = this.strings.get(stringId);

        if (!stringNotes) {
            throw new Error("String with number " + stringId + " does not exist.");
        }

        const noteIndex = stringNotes.indexOf(note);
       
        if (noteIndex === -1) {
            throw new Error("Provided note does not exists.");
        }
        note.setArticulation(articulation);
    }

    public setOverflow(note: Note, stringId: number, overflow: boolean) {
        const stringNotes = this.strings.get(stringId);

        if (!stringNotes) {
            throw new Error("String with number " + stringId + " does not exist.");
        }

        const noteIndex = stringNotes.indexOf(note);

        if (noteIndex === -1) {
            throw new Error("Provided note does not exists.");
        }
        note.overflow = overflow;
    }

    public setSlide(note: Note, stringId: number, slide: boolean) {
        const stringNotes = this.strings.get(stringId);

        if (!stringNotes) {
            throw new Error("String with number " + stringId + " does not exist.");
        }

        const noteIndex = stringNotes.indexOf(note);

        if (noteIndex === -1) {
            throw new Error("Provided note does not exists.");
        }
        note.slide = slide;
    }
}
