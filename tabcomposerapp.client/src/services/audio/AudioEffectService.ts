import * as Tone from 'tone';

export class AudioEffectService {

    private bandpassFilter: Tone.AutoFilter;
    private noiseGate: Tone.Gate;  // Opcjonalnie: W zale¿noœci od potrzeby odszumianie
    private compressor: Tone.Compressor;
    //private chain: Tone.E

    constructor() {
        // Filtr pasmowy ustawiony na czêstotliwoœci charakterystyczne dla gitary
        this.bandpassFilter = new Tone.AutoFilter({
         //   type: 'bandpass',
            frequency: 500,    // Œrodek pasma dla gitary
          //  rolloff: -96,      // S³absze t³umienie poza pasmem
          //  Q: 1               // Szerokoœæ pasma
        })

        // Opcjonalnie: Noise Gate do eliminacji szumów
        this.noiseGate = new Tone.Gate({
            threshold: 30,  // Poziom czu³oœci na szum
        })

        // Kompresor: pozwala wyrównaæ poziom dŸwiêku
        this.compressor = new Tone.Compressor({
            threshold: -20,  // Próg kompresji
            ratio: 4,        // Stosunek kompresji
            attack: 0.003,   // Czas ataku
            release: 0.25    // Czas zwolnienia
        })
    }

    // Funkcja do uzyskania wêz³a z efektami
    public getNode(): Tone.InputNode { 
        return this.bandpassFilter
            .connect(this.noiseGate)
            .connect(this.compressor);  
    }

    // Metoda umo¿liwiaj¹ca zmianê pasma filtru
    public adjustFrequency(frequency: number): void {
        this.bandpassFilter.frequency.value = frequency;
    }

    public toDestination() {
        this.compressor.toDestination();
    }

    public disconnectFromDestination() {
         this.compressor.disconnect(Tone.getDestination());
    }

    public connect(node: Tone.ToneAudioNode) { //tutaj wpinam analyzera
        this.bandpassFilter.connect(this.noiseGate);
        this.noiseGate.connect(this.compressor);
        this.compressor.connect(node);
    }

    public disconnect() {
        this.bandpassFilter.disconnect();
        this.noiseGate.disconnect();
        this.compressor.disconnect();
    }
}
