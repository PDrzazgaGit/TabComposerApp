import * as Tone from 'tone';

export class AudioEffectService {

    private outputNode: Tone.ToneAudioNode;
    private inputNode: Tone.ToneAudioNode;

    private highpassFilter: Tone.Filter;
    private lowpassFilter: Tone.Filter;
   // private bandpassFilter: Tone.Filter;
    private noiseReduction: Tone.EQ3;
    private compressor: Tone.Compressor;
    private normalizer: Tone.Gain;

    constructor(private minFrequency: number = 60, private maxFrequency: number = 1400) {
        // Filtr górnoprzepustowy

        const fc = Math.sqrt(minFrequency * maxFrequency);
        const df = maxFrequency - minFrequency;
        const Q = fc / df;

        this.highpassFilter = new Tone.Filter({
            frequency: this.minFrequency,
            type: "highpass",
            Q: Q,
            rolloff: -12
        });

        // Filtr dolnoprzepustowy
        this.lowpassFilter = new Tone.Filter({
            frequency: this.maxFrequency,
            type: "lowpass",
            Q: Q,
            rolloff: -12
        });
        /*
        // Filtr pasmowoprzepustowy
        this.bandpassFilter = new Tone.Filter({
            frequency: (this.minFrequency + this.maxFrequency) / 2,
            type: "bandpass",
            Q: 5,
        });
        */
        // Redukcja szumów
        this.noiseReduction = new Tone.EQ3({
            low: -12,
            mid: 5,
            high: -40,
        });

        // Kompresor
        this.compressor = new Tone.Compressor({
            threshold: -24,
            ratio: 10,
            attack: 0.003,
            release: 0.25,
        });

        // Normalizacja amplitudy
        this.normalizer = new Tone.Gain(1);

        // Po³¹czenie efektów w ³añcuch
        this.inputNode = this.highpassFilter;
        this.highpassFilter.connect(this.lowpassFilter);
        this.lowpassFilter.connect(this.noiseReduction);//this.lowpassFilter.connect(this.bandpassFilter);

        //this.bandpassFilter.connect(this.noiseReduction);
        //this.noiseReduction.connect(this.compressor);
       // this.compressor.connect(this.normalizer);
        // this.outputNode = this.normalizer;
        this.outputNode = this.lowpassFilter;
    }

    public connect(node: Tone.InputNode): void {
        this.outputNode.connect(node);
    }

    public disconnect(): void {
        this.outputNode.disconnect();
    }

    public toDestination() {
        this.outputNode.connect(Tone.getDestination());
    }

    public disconnectFromDestination() {
        this.outputNode.disconnect(Tone.getDestination());
    }

    public getInputNode(): Tone.InputNode {
        return this.inputNode;
    }
}
