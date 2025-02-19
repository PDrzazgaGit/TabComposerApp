import * as Tone from 'tone';

type WindowFunctionType = "hann" | "blackman" | "square";
export class WindowService {
    private windowShaper: Tone.WaveShaper;
    constructor(public readonly type: WindowFunctionType, private size: number = 1024) {
        switch (this.type) {
            case "hann":
                this.windowShaper = new Tone.WaveShaper(this.createHanningWindow(this.size), this.size);
                break;
            case "blackman":
                this.windowShaper = new Tone.WaveShaper(this.createBlackmanWindow(this.size), this.size);
                break;
            case "square":
                this.windowShaper = new Tone.WaveShaper();
                break;
        }
        
    }

    public connect(node: Tone.ToneAudioNode): void {
        this.windowShaper.connect(node);
    }

    public disconnect(): void {
        this.windowShaper.disconnect();
    }

    public toDestination() {
        this.windowShaper.connect(Tone.getDestination());
    }

    public disconnectFromDestination() {
        this.windowShaper.disconnect(Tone.getDestination());
    }

    public getInputNode(): Tone.InputNode {
        return this.windowShaper;
    }

    private createHanningWindow(size: number): Float32Array {
        const window = new Float32Array(size);
        for (let i = 0; i < size; i++) {
            window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
        }
        return window;
    }

    private createBlackmanWindow(size: number): Float32Array {
        const window = new Float32Array(size);
        for (let i = 0; i < size; i++) {
            window[i] = 0.42 - 0.5 * Math.cos((2 * Math.PI * i) / (size - 1)) + 0.08 * Math.cos((4 * Math.PI * i) / (size - 1));
        }
        return window;
    }

}