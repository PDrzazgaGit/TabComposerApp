import * as Tone from 'tone';
import { MicrophoneSelector } from './MicrophoneSelector';

export class MicrophoneService {
    public microphoneSelector: MicrophoneSelector;
    private mic: Tone.UserMedia | null;
    private analyser: Tone.Analyser;
    private isOpen: boolean;
    private bandpassFilter: Tone.Filter;
    private noiseGate: Tone.Gate;

    constructor() {
        this.microphoneSelector = new MicrophoneSelector();
        this.mic = null;
        this.analyser = new Tone.Analyser('fft', 1024); 
        this.isOpen = false; 
        this.noiseGate = new Tone.Gate(0.05);
        this.bandpassFilter = new Tone.Filter(500, 'bandpass').toDestination();
    }


    async getAvailableMicrophones(): Promise<MediaDeviceInfo[]> {
        return this.microphoneSelector.getDevices();
    }

    // Inicjalizacja mikrofonu (domy�lne urz�dzenie)
    async init(deviceId: string): Promise<boolean> {
        try {
            if (!this.mic) {
                this.mic = new Tone.UserMedia();
            }
            await this.mic.open(deviceId); // Otw�rz domy�lny mikrofon
            console.log('Microphone initialized successfully.');
            this.isOpen = true;

            // Pod��cz mikrofon do analizatora
           // this.bandpassFilter.connect(this.analyser);
            //this.noiseGate.connect(this.analyser);
            this.mic.connect(this.analyser);


            //this.mic.connect(Tone.getContext().destination);

            return true;
        } catch (error) {
            console.error('Error initializing microphone:', error);
            return false;
        }
    }

    // Pobranie danych cz�stotliwo�ciowych (FFT)
    getFrequencyData() {
        if (!this.isOpen) {
            throw new Error('Microphone is not open. Call init() or setMicrophone() first.');
        }
        const fftData = this.analyser.getValue();

        return fftData; // Zwraca dane FFT jako tablic�
    }

    // Pobranie danych cz�stotliwo�ciowych (FFT) i wyodr�bnienie cz�stotliwo�ci
    getDetectedFrequencies(): number {
        if (!this.isOpen) {
            throw new Error('Microphone is not open. Call init() first.');
        }

        const fftData = this.analyser.getValue() as Float32Array;
        let maxLevel = -Infinity;  // Najmniejsza mo�liwa warto�� dla dB
        let maxIndex = -1;

        for (let i = 0; i < fftData.length; i++) {
            if (fftData[i] > maxLevel) {
                maxLevel = fftData[i];
                maxIndex = i;
            }
        }

        const frequency = maxIndex * (44100 / 1024); // Przekszta�cenie indeksu na cz�stotliwo��

        return frequency;
    }

    // Zamkni�cie mikrofonu
    stop() {
        if (this.isOpen && this.mic) {
            this.mic.close();
            console.log('Microphone closed.');
            this.isOpen = false;
        }
    }
}
