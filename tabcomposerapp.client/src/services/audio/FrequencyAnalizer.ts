import * as Tone from 'tone';

export class FrequencyAnalyzer {
    private analyser: Tone.Analyser;

    constructor(analyser: Tone.Analyser) {
        this.analyser = analyser;
    }

    getDominantFrequency(): number | null {
        const fftValues = this.analyser.getValue() as Float32Array; // Pobierz wartoúci FFT
        const maxAmplitude = Math.max(...fftValues); // Znajdü maksymalnπ amplitudÍ
        const maxIndex = fftValues.indexOf(maxAmplitude); // Znajdü indeks maksymalnej amplitudy

        if (maxAmplitude <= 0) {
            return null; // Brak dominujπcej czÍstotliwoúci
        }

        const sampleRate = Tone.getContext().sampleRate; // Pobierz czÍstotliwoúÊ prÛbkowania
        const fftSize = this.analyser.size; // D≥ugoúÊ FFT

        // Przelicz indeks FFT na czÍstotliwoúÊ
        const frequency = (maxIndex * sampleRate) / (fftSize * 2);
        return frequency;
    }
}
