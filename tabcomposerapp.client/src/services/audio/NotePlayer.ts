import * as Tone from "tone";
import { INote } from "../../models";
import { TransportClass } from "tone/build/esm/core/clock/Transport";

export class NotePlayer {
    private synth: Tone.PolySynth;
    private transport: TransportClass;
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.transport = Tone.getTransport();
    }

    public static async start() {
        await Tone.start();
    }

    public stop() {
        this.transport.stop();
        this.transport.cancel(); 
    }

    public async play(note: INote, startTimeMs?: number) {

        if (["stopped", "paused"].includes(this.transport.state)) {
            console.warn("Cannot play note. Transport is stopped or paused.");
            return;
        }

        await Tone.start();
        this.transport.start();

        const noteTimeSeconds = note.getTimeStampMs()/1000 + (startTimeMs ? startTimeMs / 1000 : Tone.now()) ;
        const noteDurationSeconds = note.getDurationMs() / 1000;

        this.transport.scheduleOnce((time) => {
            this.synth.triggerAttackRelease(
                note.frequency,        // Czêstotliwoœæ
                noteDurationSeconds,   // Czas trwania
                time                   // Zaplanowany czas rozpoczêcia
            );
        }, noteTimeSeconds);
    }

}