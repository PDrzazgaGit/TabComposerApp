import { ITabulature } from "../../models";
import { FFTAnalyzerService, IFFTAnalyzerService } from "./FFTAnalyzerService";
import { IMicrophoneService, MicrophoneService } from "./MicrophoneService";
import { MicrophoneSelector } from "./MicrophoneSelector";
import { AudioEffectService } from "./AudioEffectService";
import { makeObservable, observable, runInAction } from "mobx";
import * as Tone from 'tone';
export interface ITabulatureRecorder {
    readonly monite: boolean;
    readonly recording: boolean;
    readonly effectsOn: boolean;
    record(deviceId: string): Promise<boolean>;
    moniteToggle(deviceId: string): Promise<boolean>;
    effectsToggle(): boolean;
    stop(): void;
    draw(canvas: HTMLCanvasElement): void;
    getF(): number;
    getAvailableMicrophones(): Promise<MediaDeviceInfo[]>;
}
export class TabulatureRecorder {

    private microphoneSelector: MicrophoneSelector;
    private microphone: IMicrophoneService;
    private analyzer: IFFTAnalyzerService;
    private effect: AudioEffectService;
    public recording: boolean;
    public effectsOn: boolean;
    public monite: boolean;

    constructor(private tabulature: ITabulature) {
        this.microphoneSelector = new MicrophoneSelector();
        this.microphone = MicrophoneService.getInstance();
        this.analyzer = new FFTAnalyzerService(1024);
        this.effect = new AudioEffectService();
        this.microphone.connect(this.effect.getNode());
        this.effect.connect(this.analyzer);
        //this.microphone.connect(this.analyzer);
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
                this.analyzer.connect(Tone.getDestination());
                runInAction(() => this.monite = true);
                return true;

            } else {
                this.analyzer.disconnect(Tone.getDestination());
                runInAction(() => this.monite = false);
                this.microphone.stop();
                return false;
            }

        } catch {
            this.analyzer.disconnect(Tone.getDestination())
            runInAction(() => this.monite = false);
            this.microphone.stop();
            return false;
        }
    }

    public effectsToggle(): boolean {
        try {

            if (!this.effectsOn) {
                this.microphone.disconnect(this.analyzer);
                this.microphone.connect(this.effect.getNode());
                this.effect.connect(this.analyzer);
                runInAction(() => this.effectsOn = true);
            } else {
                this.effect.disconnect();
                this.microphone.connect(this.analyzer);
                runInAction(() => this.effectsOn = false);
            }
            return this.effectsOn;
        } catch {
            console.log("upz")
            return false;
        }
        
    }

    public draw(canvas: HTMLCanvasElement) {
        this.analyzer.animateFrequencyPlot(canvas);
    }

    public getF() {
        if (this.microphone.active)
            return this.analyzer.getDominantFrequency();
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