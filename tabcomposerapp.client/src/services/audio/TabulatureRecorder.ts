import { ITabulature } from "../../models";
import { MicrophoneService } from "./MicrophoneService";

export class TabulatureRecorder {
    private microphone: MicrophoneService;

    constructor(private tabulature: ITabulature) {
        this.microphone = new MicrophoneService();
    }

    public async record(deviceId: string): Promise<boolean> {
        if (!await this.microphone.init(deviceId)) {
            return false;
        }
        //...
        return true;
    }


    public getF() {
        return this.microphone.getDetectedFrequencies();
    }

    public get microphoneSelector() {
        return this.microphone.microphoneSelector;
    }

    public stop(): void {
        this.microphone.stop();
    }
}