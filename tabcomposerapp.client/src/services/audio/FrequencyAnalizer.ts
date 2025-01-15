import * as Tone from 'tone';

export class FrequencyAnalyzer {
    private analyser: Tone.Analyser;

    constructor(analyser: Tone.Analyser) {
        this.analyser = analyser;
    }

    getDominantFrequency(): number | null {
        const fftValues = this.analyser.getValue() as Float32Array; // Pobierz warto�ci FFT
        const maxAmplitude = Math.max(...fftValues); // Znajd� maksymaln� amplitud�
        const maxIndex = fftValues.indexOf(maxAmplitude); // Znajd� indeks maksymalnej amplitudy

        if (maxAmplitude <= 0) {
            return null; // Brak dominuj�cej cz�stotliwo�ci
        }

        const sampleRate = Tone.getContext().sampleRate; // Pobierz cz�stotliwo�� pr�bkowania
        const fftSize = this.analyser.size; // D�ugo�� FFT

        // Przelicz indeks FFT na cz�stotliwo��
        const frequency = (maxIndex * sampleRate) / (fftSize * 2);
        return frequency;
    }
}
