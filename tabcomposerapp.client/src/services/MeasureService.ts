import { ITuning, Note, NoteDuration, Sound, IMeasure, Pause, NoteKind, Articulation } from '../models';
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

        super();

        this.measureDurationMs = this.calculateMeasureDurationMs(this.tempo, this.numerator, this.denominator);
        this.wholeNoteDurationMs = this.calculateWholeNoteDurationMs();

        tuning.forEach((stringId: number) => {
            this.set(Number(stringId), new Array<Note>());     
        });
    }

    public clone(): MeasureService {
        const measure: MeasureService = new MeasureService(this.tempo, this.numerator, this.denominator, this.tuning, this.frets);
        this.forEach((notes, stringId) => {
            measure.set(Number(stringId), notes);
        })
        return measure;
    }

    public deepClone(): MeasureService {
        const measure: MeasureService = new MeasureService(this.tempo, this.numerator, this.denominator, this.tuning, this.frets);
        this.forEach((notes, stringId) => {
            const clonedNotes: (Note | Pause)[] = [];
            console.log(notes);
            notes.forEach(note => {
                const clonedNote = note.clone();
                console.log(clonedNote);
                clonedNotes.push(clonedNote);
            })
            measure.set(Number(stringId), clonedNotes);
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

    private calculateMeasureDurationMs(tempo: number, numerator: number, denominator: number): number {
        return (MINUTE_IN_MS / tempo) * (numerator * (4 / denominator));
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
            console.log(note);
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
        const stringNotes: Note[] = this.get(stringId)!;
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
                        if (newStartTime + stringNotes[i].getDurationMs() > this.measureDurationMs) {
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
        const stringNotes = this.get(stringId);
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
        this.set(Number(stringId), stringNotes);
    }

    public moveNoteRight(note: Note | Pause, stringId: number, interval: NoteDuration = note.noteDuration): boolean {
        const stringNotes = this.get(stringId);
        if (!stringNotes) {
            throw new Error("String with number " + stringId + " does not exist.");
        }

        const index = stringNotes.findIndex(item => item === note);
        if (index === -1) {
            throw new Error("Note does not exist.");
        }

        const intervalMs = this.calculateNoteDurationMs(interval);
        let newStartTime = note.getTimeStampMs() + intervalMs;

        if (newStartTime + note.getDurationMs() > this.measureDurationMs) {
            return false;
        }

        if (index !== stringNotes.length - 1) {

            const newEndTime = note.getEndTimeStampMs() + intervalMs;


            const isCollision = stringNotes.some((otherNote, i) => {
                if (i !== index) {

                    const otherNoteEnd = otherNote.getEndTimeStampMs();
                    const otherNoteStart = otherNote.getTimeStampMs();

                    return (
                        (newStartTime < otherNoteEnd && newEndTime > otherNoteStart) || // Nak³adanie siê
                        (newStartTime >= otherNoteStart && newEndTime <= otherNoteEnd) || // Zawieranie siê w innej nucie
                        (newStartTime <= otherNoteStart && newEndTime >= otherNoteEnd)    // Ca³kowite obejmowanie innej nuty
                    );
                }
                return false;
            });

            if (isCollision) {
                //return false;
                const rightNote = stringNotes[index + 1];
                if (rightNote.getDurationMs() === note.getDurationMs()) {
                    newStartTime = rightNote.getTimeStampMs();
                    rightNote.setTimeStampMs(note.getTimeStampMs());
                } else {
                    //return false;
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

    public moveNoteLeft(note: Note | Pause, stringId: number, interval: NoteDuration = note.noteDuration): boolean {
        const stringNotes = this.get(stringId);
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
                        (newStartTime < otherNoteEnd && newEndTime > otherNoteStart) || // Nak³adanie siê
                        (newStartTime >= otherNoteStart && newEndTime <= otherNoteEnd) || // Zawieranie siê w innej nucie
                        (newStartTime <= otherNoteStart && newEndTime >= otherNoteEnd)    // Ca³kowite obejmowanie innej nuty
                    );
                }
                return false;
            });

            if (isCollision) {
                const leftNote = stringNotes[index - 1];
                if (leftNote.getDurationMs() === note.getDurationMs()) {
                    newStartTime = leftNote.getTimeStampMs();
                    leftNote.setTimeStampMs(note.getTimeStampMs());                    
                } else {
                    //return false;
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

        this.forEach((notes) => {
            const filteredNotes = notes.filter(note => {
                return (note.getTimeStampMs() + note.getDurationMs()) <= newMeasureDurationMs;
            });

            if (notes.length != filteredNotes.length)
                noteLoss = true;;
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

        this.tempo = tempo;
        this.measureDurationMs = this.calculateMeasureDurationMs(this.tempo, this.numerator, this.denominator);
        this.wholeNoteDurationMs = this.calculateWholeNoteDurationMs();

        

        this.forEach((notes, stringId) => {
            const notesData = notes.map(note => ({
                fret: note.fret,
                noteDuration: note.noteDuration,
                kind: note.kind,
                articulation: note.articulation
            }))
            this.set(Number(stringId), []);
            notesData.forEach(note => {
                if (note.kind === NoteKind.Note)
                    this.pushNote(note.fret, stringId, note.noteDuration)?.setArticulation(note.articulation);
                    //this.putNote(note.fret, stringId, note.timeStamp, note.noteDuration)?.setArticulation(note.articulation);
                else
                    this.pushPause(stringId, note.noteDuration);
                    //this.putPause(stringId, note.timeStamp, note.noteDuration);
            })
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

        //const noteDurationMs = this.calculateNoteDurationMs(noteDuration);
        const noteDurationMs = this.calculateNoteDurationMs(noteDuration)
        const endTimestamp = timeStamp + noteDurationMs;

        if (!this.isWithinMeasure(timeStamp, noteDurationMs)) {
            return false; // Nutka przekracza d³ugoœæ metrum
        }

        const hasCollision = (notes: Note[]): boolean => {
            return notes.some(existingNote => {
                const existingStart = existingNote.getTimeStampMs();
                const existingEnd = existingStart + existingNote.getDurationMs();
                console.log("Existing", existingStart, existingEnd)
                console.log("new", timeStamp, endTimestamp)
                return timeStamp < Math.floor(existingEnd) && endTimestamp > Math.floor(existingStart);
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
            console.log("sadfsdf")
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

    public canPushNote(stringId: number, noteDuration: NoteDuration): boolean {
        const stringNotes = this.get(stringId);

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

    public changeArticulation(note: Note, stringId: number, articulation: Articulation) {
        const stringNotes = this.get(stringId);

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
        const stringNotes = this.get(stringId);

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
        const stringNotes = this.get(stringId);

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
