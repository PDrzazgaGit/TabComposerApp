import * as Tone from 'tone';

export class MicrophoneService {
    private mic: Tone.UserMedia;
    private analyser: Tone.Analyser;
    private isOpen: boolean;
    constructor() {
        this.mic = new Tone.UserMedia(); // Tone.UserMedia do obs³ugi mikrofonu
        this.analyser = new Tone.Analyser('fft', 1024); // Analizator FFT do analizy czêstotliwoœci
        this.isOpen = false; // Status mikrofonu
    }

    // Inicjalizacja mikrofonu
    async init(): Promise<boolean> {
        try {
            await this.mic.open(); // Otwórz dostêp do mikrofonu
            console.log('Microphone initialized successfully.');
            this.isOpen = true;

            // Pod³¹cz mikrofon do analizatora
            this.mic.connect(this.analyser);
            return true;
        } catch (error) {
            console.error('Error initializing microphone:', error);
            return false;
        }
    }

    // Pobranie danych czêstotliwoœciowych (FFT)
    getFrequencyData() {
        if (!this.isOpen) {
            throw new Error('Microphone is not open. Call init() first.');
        }
        return this.analyser.getValue(); // Zwraca dane FFT jako tablicê
    }

    // Zamkniêcie mikrofonu
    stop() {
        if (this.isOpen) {
            this.mic.close();
            console.log('Microphone closed.');
            this.isOpen = false;
        }
    }
}
