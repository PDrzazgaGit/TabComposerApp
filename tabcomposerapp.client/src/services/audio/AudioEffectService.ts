import * as Tone from 'tone';

export class AudioEffectService {

    private bandpassFilter: Tone.AutoFilter;
    private noiseGate: Tone.Gate;  // Opcjonalnie: W zale�no�ci od potrzeby odszumianie
    private compressor: Tone.Compressor;
    //private chain: Tone.E

    constructor() {
        // Filtr pasmowy ustawiony na cz�stotliwo�ci charakterystyczne dla gitary
        this.bandpassFilter = new Tone.AutoFilter({
         //   type: 'bandpass',
            frequency: 500,    // �rodek pasma dla gitary
          //  rolloff: -96,      // S�absze t�umienie poza pasmem
          //  Q: 1               // Szeroko�� pasma
        })

        // Opcjonalnie: Noise Gate do eliminacji szum�w
        this.noiseGate = new Tone.Gate({
            threshold: 30,  // Poziom czu�o�ci na szum
        })

        // Kompresor: pozwala wyr�wna� poziom d�wi�ku
        this.compressor = new Tone.Compressor({
            threshold: -20,  // Pr�g kompresji
            ratio: 4,        // Stosunek kompresji
            attack: 0.003,   // Czas ataku
            release: 0.25    // Czas zwolnienia
        })
    }

    // Funkcja do uzyskania w�z�a z efektami
    public getNode(): Tone.InputNode { 
        return this.bandpassFilter
            .connect(this.noiseGate)
            .connect(this.compressor);  
    }

    // Metoda umo�liwiaj�ca zmian� pasma filtru
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
