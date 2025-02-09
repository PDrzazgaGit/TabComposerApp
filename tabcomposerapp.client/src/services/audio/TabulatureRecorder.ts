import { IMeasure, ITabulature, NoteDuration } from "../../models";
import { IMicrophoneService, MicrophoneService } from "./MicrophoneService";
import { MicrophoneSelector } from "./MicrophoneSelector";
import { AudioEffectService } from "./AudioEffectService";
import { makeObservable, observable, runInAction } from "mobx";
import { AnalyzerService } from "./AnalyzerService";
import { AMDFAnalyzerService } from "./AMDFAnalyzerService";
import { FFTAnalyzerService } from "./FFTAnalyzerService";
import { MusicScale } from "../MusicScale";
import { WindowService } from "./WindowService";
import { BufferAnalyser, FrequencyBuffer } from "./BufferAnalyser";
import { TablaturePosition, TablaturePositionFinder } from "../TablaturePositionFinder";

export interface ITabulatureRecorder {
    readonly monite: boolean;
    readonly recording: boolean;
    readonly effectsOn: boolean;
    record(deviceId: string, tempo: number, tempoFactor: number, numerator: number, denominator: number, duration: NoteDuration): Promise<boolean>;
    moniteToggle(deviceId: string): Promise<boolean>;
    effectsToggle(): boolean;
    stop(): void;
    draw(canvasAMDF: HTMLCanvasElement, canvasFFT: HTMLCanvasElement): {
        stopAMDF: () => void;
        stopFFT: () => void;
      
    };
    printValues(): void;
    getAvailableMicrophones(): Promise<MediaDeviceInfo[]>;
    getPlayingSound(): string
}
export class TabulatureRecorder {

    private microphoneSelector: MicrophoneSelector;
    private microphone: IMicrophoneService;
    private AMDFAnalyzer: AnalyzerService;
    private FFTAnalizer: AnalyzerService;
    private effectService: AudioEffectService;
    private windowService: WindowService;
    public recording: boolean;
    public effectsOn: boolean;
    public monite: boolean;
    private bufferAnalyser: BufferAnalyser;
    private tablaturePositionFinder: TablaturePositionFinder;

    constructor(private tabulature: ITabulature, private minFrequency: number = 60, private maxFrequency: number = 1400) {
        this.microphoneSelector = new MicrophoneSelector();
        this.microphone = MicrophoneService.getInstance();
        this.AMDFAnalyzer = new AMDFAnalyzerService(1024, minFrequency, maxFrequency);
        this.FFTAnalizer = new FFTAnalyzerService(2048, minFrequency, maxFrequency);
        this.effectService = new AudioEffectService(this.minFrequency, this.maxFrequency);
        this.windowService = new WindowService("blackman", 2048);
        this.microphone.connect(this.effectService.getInputNode());
        this.effectService.connect(this.AMDFAnalyzer);
        this.effectService.connect(this.windowService.getInputNode());
        this.windowService.connect(this.FFTAnalizer);
        this.effectsOn = true;
        this.recording = false;
        this.monite = false;
        this.bufferAnalyser = new BufferAnalyser(this.AMDFAnalyzer, 0.025);
        this.tablaturePositionFinder = new TablaturePositionFinder(tabulature.tuning, tabulature.frets);
        makeObservable(this, {
            recording: observable,
            effectsOn: observable,
            monite: observable
        })
    }

    public async record(deviceId: string, tempo: number, tempoFactor: number, numerator: number, denominator: number, duration: NoteDuration): Promise<boolean> {
        if (!await this.microphone.init(deviceId)) {
            return false;
        }
        runInAction(() => this.recording = true);

        this.bufferAnalyser.start(tempo, tempoFactor, numerator, denominator, duration);

        return true;
    }

    public async moniteToggle(deviceId: string): Promise<boolean> {
        try {
            if (this.recording)
                return false;
            if (await this.microphone.init(deviceId)) {
                if (this.effectsOn) {
                    this.effectService.toDestination();
                } else {
                    this.microphone.toDestination()
                }
                runInAction(() => this.monite = true);
                return true;

            } else {
                if (this.effectsOn) {
                    this.effectService.disconnectFromDestination();
                } else {
                    this.microphone.disconnectFromDestination();
                }
                runInAction(() => this.monite = false);
                this.microphone.stop();
                return false;
            }

        } catch {
            if (this.effectsOn) {
                this.effectService.disconnectFromDestination();
            } else {
                this.microphone.disconnectFromDestination();
            }
            runInAction(() => this.monite = false);
            this.microphone.stop();
            return false;
        }
    }

    public effectsToggle(): boolean {
        try {
            this.microphone.disconnect()
            if (!this.effectsOn) {
                this.microphone.connect(this.effectService.getInputNode());
                this.effectService.connect(this.windowService.getInputNode());
                this.effectService.connect(this.AMDFAnalyzer);
                if (this.monite) {
                    this.effectService.toDestination();
                }
                runInAction(() => this.effectsOn = true);
            } else {
                this.effectService.disconnect();
                this.microphone.connect(this.windowService.getInputNode())
                this.microphone.connect(this.AMDFAnalyzer)
                if (this.monite) {
                    this.microphone.toDestination();
                }
                runInAction(() => this.effectsOn = false);
            }
            return this.effectsOn;
        } catch {
            this.effectService.disconnect();
            this.microphone.connect(this.windowService.getInputNode())
            this.microphone.connect(this.AMDFAnalyzer)
            runInAction(() => this.effectsOn = false);
            return false;
        }
        
    }

    public draw(canvasAMDF: HTMLCanvasElement, canvasFFT: HTMLCanvasElement) {
        const stopAMDF = this.AMDFAnalyzer.animatePlot(canvasAMDF);
        const stopFFT = this.FFTAnalizer.animatePlot(canvasFFT);

        return {
            stopAMDF,
            stopFFT
           
        };
    }

    public getPlayingSound(): string {
        const amdf = this.AMDFAnalyzer.getDominantFrequency();
        const fft = this.FFTAnalizer.getDominantFrequency();
        console.log(fft)
        if (!amdf)
            return 'unknown';
        const sound = MusicScale.getSoundFromFrequency(amdf);
        return `${sound?.getName()}${sound?.octave}`;
    }

    public printValues() {
        
        if (this.microphone.active) {
            const amdf = this.AMDFAnalyzer.getDominantFrequency();
            const fft = this.FFTAnalizer.getDominantFrequency();
            if (fft) {
                console.log(`FFT: ${fft}`)
            }
            if (amdf) {
                const sound = MusicScale.getSoundFromFrequency(amdf);

                console.log(`${sound?.getName()}${sound?.octave} | ${amdf}`)
            }
                
        }
    }

    async getAvailableMicrophones(): Promise<MediaDeviceInfo[]> {
        return this.microphoneSelector.getDevices();
    }

    private putNotesOnTablature(data: Map<number, FrequencyBuffer[]>) {

        console.log(data);

        this.tablaturePositionFinder.init();

        const tempo = this.bufferAnalyser.tempo;
        const numerator = this.bufferAnalyser.numerator;
        const denominator = this.bufferAnalyser.denominator;
        const noteDuration = this.bufferAnalyser.noteDuration;

        if (!tempo || !numerator || !denominator || !noteDuration)
            return;

        data.forEach((frequencyBuffer, measure) => {
            frequencyBuffer.forEach(sample => {
                this.tablaturePositionFinder.addSound(sample.frequency, sample.timestamp, measure);
            })
        })

        const positions: TablaturePosition[] = this.tablaturePositionFinder.getBestPositions(); //to musi być wykonane na pełnym zestawie dźwięków.
        const updateMap: Map<number, TablaturePosition[]> = new Map();
        positions.forEach(position => {
            const measureNumber = position.measureNumber;
            if (!updateMap.get(measureNumber)) {
                updateMap.set(measureNumber, [])
            } 
            updateMap.get(measureNumber)!.push(position);
        })
        updateMap.forEach((positions) => {
            const measure = this.tabulature.addMeasure(tempo, numerator, denominator) as IMeasure;
            console.log(measure.measureDurationMs)
            positions.forEach((position) => {
                console.log(measure.putNote(position.fret, position.stringNumber, Math.round(position.timeStamp * 1000 * 10)/10, noteDuration));
            })
        })
        this.bufferAnalyser.clear();
    }

    public stop(): void {
        this.microphone.stop();
        runInAction(() => this.recording = false);
        const result: Map<number, FrequencyBuffer[]> | null = this.bufferAnalyser.stopAndGetResult();
        if (result) {
            this.putNotesOnTablature(result);
        }
        //console.log(result);
        
    }
}