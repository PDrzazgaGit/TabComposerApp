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

    // Inicjalizacja mikrofonu (domyœlne urz¹dzenie)
    async init(deviceId: string): Promise<boolean> {
        try {
            if (!this.mic) {
                this.mic = new Tone.UserMedia();
            }
            await this.mic.open(deviceId); // Otwórz domyœlny mikrofon
            console.log('Microphone initialized successfully.');
            this.isOpen = true;

            // Pod³¹cz mikrofon do analizatora
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

    // Pobranie danych czêstotliwoœciowych (FFT)
    getFrequencyData() {
        if (!this.isOpen) {
            throw new Error('Microphone is not open. Call init() or setMicrophone() first.');
        }
        const fftData = this.analyser.getValue();

        return fftData; // Zwraca dane FFT jako tablicê
    }

    // Pobranie danych czêstotliwoœciowych (FFT) i wyodrêbnienie czêstotliwoœci
    getDetectedFrequencies(): number {
        if (!this.isOpen) {
            throw new Error('Microphone is not open. Call init() first.');
        }

        const fftData = this.analyser.getValue() as Float32Array;
        let maxLevel = -Infinity;  // Najmniejsza mo¿liwa wartoœæ dla dB
        let maxIndex = -1;

        for (let i = 0; i < fftData.length; i++) {
            if (fftData[i] > maxLevel) {
                maxLevel = fftData[i];
                maxIndex = i;
            }
        }

        const frequency = maxIndex * (44100 / 1024); // Przekszta³cenie indeksu na czêstotliwoœæ

        return frequency;
    }

    // Zamkniêcie mikrofonu
    stop() {
        if (this.isOpen && this.mic) {
            this.mic.close();
            console.log('Microphone closed.');
            this.isOpen = false;
        }
    }
}
