import * as Tone from 'tone';

export class MicrophoneService {
    private mic: Tone.UserMedia;
    private analyser: Tone.Analyser;
    private isOpen: boolean;
    constructor() {
        this.mic = new Tone.UserMedia(); // Tone.UserMedia do obs�ugi mikrofonu
        this.analyser = new Tone.Analyser('fft', 1024); // Analizator FFT do analizy cz�stotliwo�ci
        this.isOpen = false; // Status mikrofonu
    }

    // Inicjalizacja mikrofonu
    async init(): Promise<boolean> {
        try {
            await this.mic.open(); // Otw�rz dost�p do mikrofonu
            console.log('Microphone initialized successfully.');
            this.isOpen = true;

            // Pod��cz mikrofon do analizatora
            this.mic.connect(this.analyser);
            return true;
        } catch (error) {
            console.error('Error initializing microphone:', error);
            return false;
        }
    }

    // Pobranie danych cz�stotliwo�ciowych (FFT)
    getFrequencyData() {
        if (!this.isOpen) {
            throw new Error('Microphone is not open. Call init() first.');
        }
        return this.analyser.getValue(); // Zwraca dane FFT jako tablic�
    }

    // Zamkni�cie mikrofonu
    stop() {
        if (this.isOpen) {
            this.mic.close();
            console.log('Microphone closed.');
            this.isOpen = false;
        }
    }
}
