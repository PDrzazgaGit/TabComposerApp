import * as Tone from 'tone';

export class AudioEffectService {
    

    private outputNode: Tone.ToneAudioNode;
    private inputNode: Tone.ToneAudioNode;

    private highpassFilter: Tone.Filter;
    private bandpassFilter: Tone.Filter;
    private noiseReduction: Tone.EQ3; // Korektor do redukcji szum�w
    private compressor: Tone.Compressor; // Kompresor dla wyr�wnania dynamiki
    private normalizer: Tone.Gain; // Normalizator amplitudy

    constructor(private minFrequency: number = 60, private maxFrequency: number = 1400) {
        // Filtr g�rnoprzepustowy (t�umi cz�stotliwo�ci poni�ej zakresu gitary)
        this.highpassFilter = new Tone.Filter({
            frequency: this.minFrequency,
            type: "highpass",
            Q: 1,
        });

        // Filtr pasmowoprzepustowy (dynamiczne t�umienie szum�w spoza pasma)
        this.bandpassFilter = new Tone.Filter({
            frequency: (this.minFrequency + this.maxFrequency) / 2, // �rodek zakresu
            type: "bandpass",
            Q: 5,
        });

        // Redukcja szum�w (korektor graficzny do t�umienia niskich i wysokich szum�w)
        this.noiseReduction = new Tone.EQ3({
            low: -10, // Redukcja szum�w w niskich cz�stotliwo�ciach
            mid: 5, // Neutralne �rednie
            high: -50, // Redukcja szum�w w wysokich cz�stotliwo�ciach
        });

        // Kompresor (wyr�wnuje dynamik� sygna�u)
        this.compressor = new Tone.Compressor({
            threshold: -24, // Punkt, w kt�rym kompresor zaczyna dzia�a�
            ratio: 10, // Si�a kompresji
            attack: 0.003, // Szybko�� reakcji
            release: 0.25, // Czas powrotu do normalnego poziomu
        });

        // Normalizacja amplitudy (gain ustawiony na 1)
        this.normalizer = new Tone.Gain(1);

        // Po��czenie efekt�w
        this.inputNode = this.highpassFilter;

        this.highpassFilter.connect(this.bandpassFilter);
        this.bandpassFilter.connect(this.noiseReduction);
        this.noiseReduction.connect(this.compressor);
        this.compressor.connect(this.normalizer);

        this.outputNode = this.normalizer; // Wyj�cie gotowe do analizy FFT
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
