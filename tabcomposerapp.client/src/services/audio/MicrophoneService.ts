import * as Tone from 'tone';

export interface IMicrophoneService {
    init(deviceId: string): Promise<boolean>;
    stop(): void; 
    get active(): boolean;
    connect(destination: Tone.InputNode, outputNum?: number, inputNum?: number): IMicrophoneService;
    disconnect(destination?: Tone.InputNode, outputNum?: number, inputNum?: number): IMicrophoneService;
    toDestination(): this;
}
export class MicrophoneService extends Tone.UserMedia implements IMicrophoneService {

    private static instance: MicrophoneService | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): IMicrophoneService {
        if (!this.instance) {
            this.instance = new MicrophoneService();
        }
        return this.instance;
    }

    async init(deviceId: string): Promise<boolean> {
        if (this.active) {
            return false;
        }
        try {
            await this.open(deviceId);
            console.log('Microphone initialized successfully.');

            return true;
        } catch (error) {
            console.error('Error initializing microphone:', error);
            return false;
        }
    }

    stop(): void {
        if (this.active) {
            this.close();
            console.log('Microphone closed.');
        }
    }

    public get active() {
        if (this.state == "started") {
            return true;
        } else return false;
    }


}
