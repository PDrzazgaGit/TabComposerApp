import { ITabulature } from "../../models";
import { IMicrophoneService, MicrophoneService } from "./MicrophoneService";
import { MicrophoneSelector } from "./MicrophoneSelector";
import { AudioEffectService } from "./AudioEffectService";
import { makeObservable, observable, runInAction } from "mobx";
import * as Tone from 'tone';
import { AnalyzerService } from "./AnalyzerService";
import { AMDFAnalyzerService } from "./AMDFAnalyzerService";
import { FFTAnalyzerService } from "./FFTAnalyzerService";
export interface ITabulatureRecorder {
    readonly monite: boolean;
    readonly recording: boolean;
    readonly effectsOn: boolean;
    record(deviceId: string): Promise<boolean>;
    moniteToggle(deviceId: string): Promise<boolean>;
    effectsToggle(): boolean;
    stop(): void;
    draw(canvasAMDF: HTMLCanvasElement, canvasFFT: HTMLCanvasElement): { stopAMDF: () => void; stopFFT: () => void }
;
    getF(): number;
    getAvailableMicrophones(): Promise<MediaDeviceInfo[]>;
}
export class TabulatureRecorder {

    private microphoneSelector: MicrophoneSelector;
    private microphone: IMicrophoneService;
    private AMDFAnalyzer: AnalyzerService;
    private FFTAnalizer: AnalyzerService;
    private effect: AudioEffectService;
    public recording: boolean;
    public effectsOn: boolean;
    public monite: boolean;

    constructor(private tabulature: ITabulature) {
        this.microphoneSelector = new MicrophoneSelector();
        this.microphone = MicrophoneService.getInstance();
        this.AMDFAnalyzer = new AMDFAnalyzerService(1024);
        this.FFTAnalizer = new FFTAnalyzerService(1024);
        this.effect = new AudioEffectService();
        this.microphone.connect(this.effect.getNode());
        this.effect.connect(this.FFTAnalizer);
        this.effect.connect(this.AMDFAnalyzer);
        this.microphone.connect(this.FFTAnalizer);
        this.microphone.connect(this.AMDFAnalyzer);
        this.effectsOn = true;
        this.recording = false;
        this.monite = false;
        makeObservable(this, {
            recording: observable,
            effectsOn: observable,
            monite: observable
        })
    }

    public async record(deviceId: string): Promise<boolean> {
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
                this.AMDFAnalyzer.connect(Tone.getDestination());
                runInAction(() => this.monite = true);
                return true;

            } else {
                this.AMDFAnalyzer.disconnect(Tone.getDestination());
                runInAction(() => this.monite = false);
                this.microphone.stop();
                return false;
            }

        } catch {
            this.AMDFAnalyzer.disconnect(Tone.getDestination())
            runInAction(() => this.monite = false);
            this.microphone.stop();
            return false;
        }
    }

    public effectsToggle(): boolean {
        try {

            if (!this.effectsOn) {
                this.microphone.disconnect(this.AMDFAnalyzer);
                this.microphone.connect(this.effect.getNode());
                
                this.effect.connect(this.FFTAnalizer);
                this.effect.connect(this.AMDFAnalyzer);
                runInAction(() => this.effectsOn = true);
            } else {
                this.effect.disconnect();
                this.microphone.connect(this.AMDFAnalyzer);
                this.microphone.connect(this.FFTAnalizer);
                runInAction(() => this.effectsOn = false);
            }
            return this.effectsOn;
        } catch {
            return false;
        }
        
    }

    public draw(canvasAMDF: HTMLCanvasElement, canvasFFT: HTMLCanvasElement) {
        const stopAMDF = this.AMDFAnalyzer.animateFrequencyPlot(canvasAMDF);
        const stopFFT = this.FFTAnalizer.animateFrequencyPlot(canvasFFT);

        // Zwracamy funkcje zatrzymuj¹ce
        return {
            stopAMDF,
            stopFFT
        };
    }

    public getF() {
        if (this.microphone.active) {
            const num = this.AMDFAnalyzer.getDominantFrequency()
            if (num) {
                this.effect.updateAdaptiveFilter(num);
            }
            return num;
        }
            
        else
            return null;
    }

    async getAvailableMicrophones(): Promise<MediaDeviceInfo[]> {
        return this.microphoneSelector.getDevices();
    }

    public stop(): void {
        this.microphone.stop();
        runInAction(() => this.recording = false);
    }
}