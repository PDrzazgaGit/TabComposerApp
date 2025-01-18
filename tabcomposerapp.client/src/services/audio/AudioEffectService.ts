import * as Tone from 'tone';

export class AudioEffectService {
    private highpassFilter: Tone.Filter;
    private lowpassFilter: Tone.Filter;
    private noiseReduction: Tone.EQ3;
    private noiseGate: Tone.Gate;
    private compressor: Tone.Compressor;
    private adaptiveFilter: Tone.Filter;
    private connectedNode: Tone.ToneAudioNode | null = null;

    constructor() {
        // Filtr g�rnoprzepustowy (agresywnie t�umi niskie cz�stotliwo�ci)
        this.highpassFilter = new Tone.Filter({
            type: "highpass",
            frequency: 100,
            rolloff: -24,
        });

        // Filtr dolnoprzepustowy (dynamiczne t�umienie wy�szych szum�w)
        this.lowpassFilter = new Tone.Filter({
            type: "lowpass",
            frequency: 5000, // G�rna granica cz�stotliwo�ci dla gitary
            rolloff: -24,
        });

        // Redukcja szumu w pasmach cz�stotliwo�ci
        this.noiseReduction = new Tone.EQ3({
            low: -6, // Dodatkowe t�umienie niskich pasm
            mid: 0,
            high: -2, // Lekko t�umi wysokie szumy
        });

        // Brama szum�w
        this.noiseGate = new Tone.Gate({
            threshold: -45, // Progi ni�sze dla cichszych d�wi�k�w gitary
            smoothing: 0.05,
        });

        // Kompresor
        this.compressor = new Tone.Compressor({
            threshold: -30,
            ratio: 4,
            attack: 0.01,
            release: 0.2,
        });

        // Adaptive Filter (dynamiczne dostosowanie cz�stotliwo�ci odci�cia)
        this.adaptiveFilter = new Tone.Filter({
            type: "lowpass",
            frequency: 3000, // Pocz�tkowa warto�� odci�cia
            rolloff: -12,
        });
    }

    // Funkcja do dynamicznego odszumiania
    public updateAdaptiveFilter(dominantFrequency: number): void {
        const targetFrequency = Math.min(3000, dominantFrequency * 1.5); // Dostosowanie filtra w g�r� o 50% dominuj�cej cz�stotliwo�ci
        this.adaptiveFilter.frequency.rampTo(targetFrequency, 0.1); // G�adkie przej�cie
    }

    public getNode(): Tone.InputNode {
        return this.highpassFilter;
    }

    // Pod��czenie efekt�w do kolejnego w�z�a
    public connect(node: Tone.ToneAudioNode): void {
        if (this.connectedNode) {
            this.disconnect();
        }
        this.highpassFilter
            .connect(this.lowpassFilter)
            .connect(this.noiseReduction)
            .connect(this.noiseGate)
            .connect(this.adaptiveFilter)
            .connect(this.compressor)
            .connect(node);

        this.connectedNode = node;
    }

    // Roz��czenie ca�ego �a�cucha
    public disconnect(): void {
        if (this.connectedNode) {
            this.highpassFilter.disconnect();
            this.lowpassFilter.disconnect();
            this.noiseReduction.disconnect();
            this.noiseGate.disconnect();
            this.adaptiveFilter.disconnect();
            this.compressor.disconnect();
            this.connectedNode = null;
        }
    }

    // Dostosowanie progu bramy szum�w
    public adjustNoiseGateThreshold(threshold: number): void {
        this.noiseGate.threshold = threshold;
    }

    // Aktualizacja filtr�w
    public adjustHighpassFrequency(frequency: number): void {
        this.highpassFilter.frequency.value = frequency;
    }

    public adjustLowpassFrequency(frequency: number): void {
        this.lowpassFilter.frequency.value = frequency;
    }

    // Pod��czenie do wyj�cia
    public toDestination(): void {
        this.compressor.toDestination();
    }

    // Roz��czenie z wyj�ciem
    public disconnectFromDestination(): void {
        this.compressor.disconnect(Tone.getDestination());
    }
}
