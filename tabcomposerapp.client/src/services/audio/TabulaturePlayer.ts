import * as Tone from "tone";

import { IMeasure, INote, IPause, ITabulature, NoteKind } from "../../models";
import { TransportClass } from "tone/build/esm/core/clock/Transport";

export class TabulaturePlayer {

    private tabulature: ITabulature;
    private synth: Tone.PolySynth;
    private transport: TransportClass;
    private readonly defaultSpeed: number;
    private currentSpeed: number;

    constructor(tabulature: ITabulature) {
        this.tabulature = tabulature;
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.transport = Tone.getTransport();
        this.defaultSpeed = this.transport.bpm.value;
        this.currentSpeed = this.defaultSpeed;
    }

    private scheduleNotes(): void {
        let currentTime = 0;
        let stopTime = 0;
        this.tabulature.forEach((measure: IMeasure) => {
            measure.forEach((notes: (INote | IPause)[]) => {
                notes.forEach(note => {
                    const duration = note.getDurationMs() / 1000; 
                    const timeStamp = note.getTimeStampMs() / 1000 + currentTime; 
                    if (note.kind === NoteKind.Pause) {
                        return;
                    }
                    stopTime += duration;
                    this.transport.schedule((time) => {
                        this.transport.bpm.value = this.currentSpeed;
                        this.synth.triggerAttackRelease(
                            (note as INote).frequency,
                            duration,
                            time
                        );
                    }, timeStamp);
                })
               
            });

            currentTime += measure.measureDurationMs / 1000; // Przesuñ czas o d³ugoœæ taktu
        }); 
        this.transport.scheduleOnce((time) => {
            this.stop();
        }, stopTime)
    }

    public async play(): Promise<void> {
        if (this.transport.state === "started") {
            return;
        }

        if (this.transport.state === "paused") {
            this.transport.start();
            return;
        }
        await Tone.start(); 
        this.scheduleNotes();
        this.transport.start();
    }

    public stop(): void {
        this.transport.stop();
        this.transport.cancel();
        this.transport.bpm.value = this.defaultSpeed;
    }

    public pause(): void {
        if (this.transport.state === "stopped") {
            return;
        }
        this.transport.pause();
    }

    public changeTempo(factor: number): void {
        this.currentSpeed = this.defaultSpeed * factor;
    }
}
