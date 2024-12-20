import * as Tone from "tone";
import { IMeasure, INote, ITabulature, NoteKind } from "../models";

export class TabulaturePlayer {
    private synth: Tone.PolySynth;
    private isPlaying: boolean;

    constructor() {
        // PolySynth simulates a polyphonic instrument (e.g., guitar with multiple strings)
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.isPlaying = false;
    }

    public async playTabulature(tabulature: ITabulature): Promise<void> {
        if (this.isPlaying) {
            console.warn("Tabulature is already playing");
            return;
        }

        this.isPlaying = true;

        // Ensure that sound can be played in the browser
        await Tone.start();

        const transport = Tone.getTransport();

        transport.stop(); // Stop any previous transport
        transport.cancel(); // Cancel any previous scheduled events

        let currentTime = transport.seconds; // Start from the current transport time

        tabulature.forEach(measure => {
            this.scheduleMeasure(measure, currentTime);
            currentTime += measure.measureDurationMs / 1000; // Update current time by the measure's duration in seconds
        });

        transport.scheduleOnce(() => {
            this.isPlaying = false;
            transport.stop(); // Stop the transport at the right moment
        }, currentTime); // Schedule it to stop after the last measure is played

        transport.start();

    }

    private scheduleMeasure(measure: IMeasure, startTime: number): void {
        measure.forEach(notes => {
            notes.forEach(note => {
                if (note.kind === NoteKind.Note) {
                    this.scheduleNote(note, startTime);
                }
            });
        });
    }

    private scheduleNote(note: INote, startTime: number): void {
        const noteTime = startTime + note.getTimeStampMs() / 1000; // Convert ms to seconds
        const noteDuration = (note.getEndTimeStampMs() - note.getTimeStampMs()) / 1000; // Convert ms to seconds

        // Schedule the sound in Tone.js relative to Tone.Transport.seconds
        this.synth.triggerAttackRelease(
            note.frequency, // Frequency of the note
            noteDuration, // Duration of the note
            noteTime // Scheduled time relative to the transport
        );
    }
}
