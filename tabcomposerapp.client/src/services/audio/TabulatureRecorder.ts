import { ITabulature, NoteDuration } from "../../models";
import { IMicrophoneService, MicrophoneService } from "./MicrophoneService";
import { MicrophoneSelector } from "./MicrophoneSelector";
import { AudioEffectService } from "./AudioEffectService";
import { makeObservable, observable, runInAction } from "mobx";
import { AnalyzerService } from "./AnalyzerService";
import { AMDFAnalyzerService } from "./AMDFAnalyzerService";
import { FFTAnalyzerService } from "./FFTAnalyzerService";
import { MusicScale } from "../MusicScale";
export interface ITabulatureRecorder {
    readonly monite: boolean;
    readonly recording: boolean;
    readonly effectsOn: boolean;
    record(deviceId: string, tempo: number, numerator: number, denominator: number, duration: NoteDuration, interval: NoteDuration): Promise<boolean>;
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
    public recording: boolean;
    public effectsOn: boolean;
    public monite: boolean;

    constructor(private tabulature: ITabulature, private minFrequency: number = 60, private maxFrequency: number = 1400) {
        this.microphoneSelector = new MicrophoneSelector();
        this.microphone = MicrophoneService.getInstance();
        this.AMDFAnalyzer = new AMDFAnalyzerService(2048, minFrequency, maxFrequency);
        this.FFTAnalizer = new FFTAnalyzerService(1024, minFrequency, maxFrequency);
        this.effectService = new AudioEffectService(this.minFrequency, this.maxFrequency);
        this.microphone.connect(this.effectService.getInputNode());
        this.effectService.connect(this.AMDFAnalyzer);
        this.effectService.connect(this.FFTAnalizer);
        this.effectsOn = true;
        this.recording = false;
        this.monite = false;
        makeObservable(this, {
            recording: observable,
            effectsOn: observable,
            monite: observable
        })
    }

    public async record(deviceId: string, tempo: number, numerator: number, denominator: number, duration: NoteDuration, interval: NoteDuration): Promise<boolean> {
        //console.log(this.tabulature.getMeasure(0)?.getNotes(6))
        if (!await this.microphone.init(deviceId)) {
            return false;
        }
        runInAction(() => this.recording = true);

        //...
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
                this.effectService.connect(this.FFTAnalizer);
                this.effectService.connect(this.AMDFAnalyzer);
                if (this.monite) {
                    this.effectService.toDestination();
                }
                runInAction(() => this.effectsOn = true);
            } else {
                this.effectService.disconnect();
                this.microphone.connect(this.FFTAnalizer)
                this.microphone.connect(this.AMDFAnalyzer)
                if (this.monite) {
                    this.microphone.toDestination();
                }
                runInAction(() => this.effectsOn = false);
            }
            return this.effectsOn;
        } catch {
            this.effectService.disconnect();
            this.microphone.connect(this.FFTAnalizer)
            this.microphone.connect(this.AMDFAnalyzer)
            runInAction(() => this.effectsOn = false);
            return false;
        }
        
    }

    public draw(canvasAMDF: HTMLCanvasElement, canvasFFT: HTMLCanvasElement) {
        const stopAMDF = this.AMDFAnalyzer.animatePlot(canvasAMDF);
        const stopFFT = this.FFTAnalizer.animatePlot(canvasFFT);



        // Zwracamy funkcje zatrzymujące
        return {
            stopAMDF,
            stopFFT
           
        };
    }

    public getPlayingSound(): string {
        const amdf = this.AMDFAnalyzer.getDominantFrequency();
        if (!amdf)
            return 'unknown';
        const sound = MusicScale.getSoundFromFrequency(amdf);
        return `${sound?.getName()}${sound?.octave}`;
    }

    public printValues() {
        if (this.microphone.active) {
            const amdf = this.AMDFAnalyzer.getDominantFrequency();
          //  const fft = this.FFTAnalizer.getDominantFrequency();
           
            if (amdf) {
                const sound = MusicScale.getSoundFromFrequency(amdf);

                console.log(`${sound?.getName()}${sound?.octave} | ${amdf}`)
                //console.log(`AMDF: ${Math.round(amdf)}, HARMONICS:${this.FFTAnalizer.findHarmonics(amdf)}`)
            }
                
        }
    }

    async getAvailableMicrophones(): Promise<MediaDeviceInfo[]> {
        return this.microphoneSelector.getDevices();
    }

    public stop(): void {
        this.microphone.stop();
        runInAction(() => this.recording = false);
    }
}