import { ITabulature } from "../../models";
import { MicrophoneService } from "./MicrophoneService";

export class TabulatureRecorder {
    private microphone: MicrophoneService;

    constructor(private tabulature: ITabulature) {
        this.microphone = new MicrophoneService();
    }

    public async record(): Promise<boolean> {
        if (!await this.microphone.init()) {
            return false;
        }
        //...
        return true;
    }

    public stop(): void {
        this.microphone.stop();
    }
}