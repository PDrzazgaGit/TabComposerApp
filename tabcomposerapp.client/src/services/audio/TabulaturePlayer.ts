import * as Tone from "tone";

import { PlaybackState } from "tone";

import { IMeasure, INote, IPause, ITabulature, NoteKind } from "../../models";
import { TransportClass } from "tone/build/esm/core/clock/Transport";

export class TabulaturePlayer {

    private tabulature: ITabulature;
    private synth: Tone.PolySynth;
    private transport: TransportClass;
    private defaultSpeed: number;

    constructor(tabulature: ITabulature) {
        this.tabulature = tabulature;
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.transport = Tone.getTransport();
        this.defaultSpeed = this.transport.bpm.value;
    }

    private scheduleNotes(): void {
        let currentTime = 0;
        console.log(currentTime)
        this.tabulature.forEach((measure: IMeasure) => {
            measure.forEach((notes: (INote | IPause)[]) => {
                console.log()
                notes.forEach(note => {
                    const duration = note.getDurationMs() / 1000; 
                    const timeStamp = note.getTimeStampMs() / 1000 + currentTime; 
                    if (note.kind === NoteKind.Pause) {
                        return;
                    }
                    this.transport.schedule((time) => {

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
            console.log(time)

        }, currentTime)
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

    public stop(time?: number): void {
        this.transport.stop(time);
        this.transport.cancel(time);
        //this.transport.dispose();
        //Tone.
    }

    public pause(): void {
        if (this.transport.state === "stopped") {
            return;
        }
        this.transport.pause();
    }

    public changeTempo(factor: number): void {
        if (factor < 0.25 || factor > 2) {
            console.error('Factor must be between 0.25 and 2');
            return;
        }

        // Zak³adaj¹c, ¿e mamy tempo bazowe
        const currentBpm = Tone.Transport.bpm.value;
        let newBpm;

        if (factor === 1) {
            // Jeœli faktor to 1, przywracamy tempo do pierwotnej wartoœci
            newBpm = this.defaultSpeed; // U¿ywamy oryginalnego tempa
        } else {
            // Jeœli factor ró¿ni siê od 1, mno¿ymy przez factor
            newBpm = currentBpm * factor;
        }

        // Stopniowa zmiana tempa (przejœcie do nowego tempa w ci¹gu 1 sekundy)
        Tone.Transport.bpm.rampTo(newBpm, 1); // Zmieniamy tempo p³ynnie
        console.log(`Nowe tempo: ${newBpm} BPM`);
    }
}
