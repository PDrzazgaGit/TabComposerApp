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
        // Filtr górnoprzepustowy (agresywnie t³umi niskie czêstotliwoœci)
        this.highpassFilter = new Tone.Filter({
            type: "highpass",
            frequency: 100,
            rolloff: -24,
        });

        // Filtr dolnoprzepustowy (dynamiczne t³umienie wy¿szych szumów)
        this.lowpassFilter = new Tone.Filter({
            type: "lowpass",
            frequency: 5000, // Górna granica czêstotliwoœci dla gitary
            rolloff: -24,
        });

        // Redukcja szumu w pasmach czêstotliwoœci
        this.noiseReduction = new Tone.EQ3({
            low: -6, // Dodatkowe t³umienie niskich pasm
            mid: 0,
            high: -2, // Lekko t³umi wysokie szumy
        });

        // Brama szumów
        this.noiseGate = new Tone.Gate({
            threshold: -45, // Progi ni¿sze dla cichszych dŸwiêków gitary
            smoothing: 0.05,
        });

        // Kompresor
        this.compressor = new Tone.Compressor({
            threshold: -30,
            ratio: 4,
            attack: 0.01,
            release: 0.2,
        });

        // Adaptive Filter (dynamiczne dostosowanie czêstotliwoœci odciêcia)
        this.adaptiveFilter = new Tone.Filter({
            type: "lowpass",
            frequency: 3000, // Pocz¹tkowa wartoœæ odciêcia
            rolloff: -12,
        });
    }

    // Funkcja do dynamicznego odszumiania
    public updateAdaptiveFilter(dominantFrequency: number): void {
        const targetFrequency = Math.min(3000, dominantFrequency * 1.5); // Dostosowanie filtra w górê o 50% dominuj¹cej czêstotliwoœci
        this.adaptiveFilter.frequency.rampTo(targetFrequency, 0.1); // G³adkie przejœcie
    }

    public getNode(): Tone.InputNode {
        return this.highpassFilter;
    }

    // Pod³¹czenie efektów do kolejnego wêz³a
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

    // Roz³¹czenie ca³ego ³añcucha
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

    // Dostosowanie progu bramy szumów
    public adjustNoiseGateThreshold(threshold: number): void {
        this.noiseGate.threshold = threshold;
    }

    // Aktualizacja filtrów
    public adjustHighpassFrequency(frequency: number): void {
        this.highpassFilter.frequency.value = frequency;
    }

    public adjustLowpassFrequency(frequency: number): void {
        this.lowpassFilter.frequency.value = frequency;
    }

    // Pod³¹czenie do wyjœcia
    public toDestination(): void {
        this.compressor.toDestination();
    }

    // Roz³¹czenie z wyjœciem
    public disconnectFromDestination(): void {
        this.compressor.disconnect(Tone.getDestination());
    }
}
