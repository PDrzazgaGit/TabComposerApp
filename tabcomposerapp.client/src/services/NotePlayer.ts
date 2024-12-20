import { INote } from "../models";

export class NotePlayer {

    protected static audioContext: AudioContext;// = new AudioContext();

    public static play(note: INote): void {
        const startTime = NotePlayer.audioContext.currentTime;
        this.scheduleNote(note, startTime);
    }

    public static playWithStartTime(note: INote, startTime: number): void {
        this.scheduleNote(note, startTime);
    }

    protected static scheduleNote(note: INote, startTime: number): void {
        const oscillator = NotePlayer.audioContext.createOscillator();
        const gainNode = NotePlayer.audioContext.createGain();

        // Ustawienia oscylatora
        oscillator.type = 'triangle';
        oscillator.frequency.value = note.frequency;

        // Ustawienia obwiedni
        const noteStart = startTime + note.getTimeStampMs() / 1000;
        const noteEnd = startTime + note.getEndTimeStampMs() / 1000;

        gainNode.gain.setValueAtTime(0, NotePlayer.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, noteStart);
        gainNode.gain.linearRampToValueAtTime(0, noteEnd);

        // Pod³¹czenie oscylatora
        oscillator.connect(gainNode);
        gainNode.connect(NotePlayer.audioContext.destination);

        oscillator.start(noteStart);
        oscillator.stop(noteEnd);
    }
}
