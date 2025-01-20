import * as Tone from 'tone';

export class AudioEffectService {
    

    private outputNode: Tone.ToneAudioNode;
    private inputNode: Tone.ToneAudioNode;

    private highpassFilter: Tone.Filter;
    private bandpassFilter: Tone.Filter;
    private noiseReduction: Tone.EQ3; // Korektor do redukcji szumów
    private compressor: Tone.Compressor; // Kompresor dla wyrównania dynamiki
    private normalizer: Tone.Gain; // Normalizator amplitudy

    constructor(private minFrequency: number = 60, private maxFrequency: number = 1400) {
        // Filtr górnoprzepustowy (t³umi czêstotliwoœci poni¿ej zakresu gitary)
        this.highpassFilter = new Tone.Filter({
            frequency: this.minFrequency,
            type: "highpass",
            Q: 1,
        });

        // Filtr pasmowoprzepustowy (dynamiczne t³umienie szumów spoza pasma)
        this.bandpassFilter = new Tone.Filter({
            frequency: (this.minFrequency + this.maxFrequency) / 2, // Œrodek zakresu
            type: "bandpass",
            Q: 5,
        });

        // Redukcja szumów (korektor graficzny do t³umienia niskich i wysokich szumów)
        this.noiseReduction = new Tone.EQ3({
            low: -10, // Redukcja szumów w niskich czêstotliwoœciach
            mid: 5, // Neutralne œrednie
            high: -50, // Redukcja szumów w wysokich czêstotliwoœciach
        });

        // Kompresor (wyrównuje dynamikê sygna³u)
        this.compressor = new Tone.Compressor({
            threshold: -24, // Punkt, w którym kompresor zaczyna dzia³aæ
            ratio: 10, // Si³a kompresji
            attack: 0.003, // Szybkoœæ reakcji
            release: 0.25, // Czas powrotu do normalnego poziomu
        });

        // Normalizacja amplitudy (gain ustawiony na 1)
        this.normalizer = new Tone.Gain(1);

        // Po³¹czenie efektów
        this.inputNode = this.highpassFilter;

        this.highpassFilter.connect(this.bandpassFilter);
        this.bandpassFilter.connect(this.noiseReduction);
        this.noiseReduction.connect(this.compressor);
        this.compressor.connect(this.normalizer);

        this.outputNode = this.normalizer; // Wyjœcie gotowe do analizy FFT
    }

    public connect(node: Tone.ToneAudioNode): void {
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
