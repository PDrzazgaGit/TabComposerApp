import { makeObservable, observable, runInAction } from 'mobx';
import * as Tone from "tone";
import { TransportClass } from "tone/build/esm/core/clock/Transport";
import { IMeasure, INote, IPause, ITabulature, NoteKind } from "../../models";


export class TabulaturePlayer {

    private tabulature: ITabulature;

    private synth: Tone.PolySynth<Tone.FMSynth>;

    private transport: TransportClass;
    private readonly defaultSpeed: number;
    private currentSpeed: number;
    public isPlaying: boolean | null;

    constructor(tabulature: ITabulature) {
        this.tabulature = tabulature;
        //this.synth = new GuitarSynth();
        this.synth = new Tone.PolySynth<Tone.FMSynth>().toDestination();
        this.transport = Tone.getTransport();
        this.defaultSpeed = this.transport.bpm.value;
        this.currentSpeed = this.defaultSpeed;
        this.isPlaying = null;
        makeObservable(this, {
            isPlaying: observable
        })
    }

    private scheduleNotes(startMeasure?: IMeasure): void {
        let currentTime = 1;
        //let stopTime = currentTime;
        let play: boolean = false;
        if (startMeasure === undefined) {
            play = true;
        }
        this.tabulature.forEach((measure: IMeasure) => {
            
            if (!play && startMeasure === measure) {
                play = true;
                
            }
            if (play) {
                measure.forEach((notes: (INote | IPause)[]) => {
                    notes.forEach((note) => {
                        
                        const duration = note.getDurationMs() / 1000;
                        const timeStamp = note.getTimeStampMs() / 1000 + currentTime;
                        if (note.kind === NoteKind.Pause) {
                            return;
                        }
                        //stopTime += duration;
                        this.transport.schedule((time) => {
                            runInAction(() => note.playing = true);
                            this.transport.bpm.value = this.currentSpeed;
                            this.synth.triggerAttackRelease(
                                (note as INote).frequency,
                                duration,
                                time
                            );

                        }, timeStamp);

                        this.transport.schedule(() => {
                            runInAction(() => note.playing = false);
                        }, timeStamp + duration);
                    })

                });
                currentTime += measure.measureDurationMs / 1000; // Przesuñ czas o d³ugoœæ taktu
            }
           
        }); 
        this.transport.scheduleOnce(() => {
            this.stop();
        }, currentTime)
    }

    public async play(startMeasure?: IMeasure): Promise<void> {
        if (this.transport.state === "started") {
            return;
        }
        runInAction(() => this.isPlaying = true)
        if (this.transport.state === "paused") {
            this.transport.start();
            return;
        }
        this.scheduleNotes(startMeasure);
        this.transport.start();
    }

    public stop(): void {
        this.transport.stop();
        this.transport.cancel();
        this.transport.bpm.value = this.defaultSpeed;
        this.tabulature.forEach(m => m.forEach(s => s.forEach(n => runInAction(() => n.playing = false))));
        runInAction(() => this.isPlaying = null)
    }

    public pause(): void {
        if (this.transport.state === "stopped") {
            return;
        }
        runInAction(() => this.isPlaying = false)
        this.transport.pause();
    }

    public changeTempo(factor: number): void {
        this.currentSpeed = this.defaultSpeed * factor;
    }
}
