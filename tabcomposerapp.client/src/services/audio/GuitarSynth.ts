import * as Tone from "tone";

export class GuitarSynth {
    private synth: Tone.FMSynth;
    private reverb: Tone.Reverb;
    private chorus: Tone.Chorus;
    private delay: Tone.FeedbackDelay;
    private distortion: Tone.Distortion;

    constructor() {
        // Tworzenie syntezatora AMSynth
        this.synth = new Tone.FMSynth({
            harmonicity: 3, // Harmoniczno�� mi�dzy no�n� a modulatorem
            oscillator: {
                type: "square", // Brzmienie przypominaj�ce strun�
            },
            envelope: {
                attack: 0.01,   // Szybki czas ataku (imitacja uderzenia struny)
                decay: 0.2,     // Stopniowe wygaszanie
                sustain: 0.6,   // Utrzymanie d�wi�ku na �rednim poziomie
                release: 0.4,   // Stopniowe wyciszanie
            },
            modulationEnvelope: {
                attack: 0.2,
                decay: 0.7,
                sustain: 0.5,
                release: 0.1,
            },
        });

        // Tworzenie efekt�w
        this.reverb = new Tone.Reverb({
            decay: 2,
            wet: 0.6, // Dodaj lekki pog�os
        });

        this.chorus = new Tone.Chorus({
            frequency: 4,
            delayTime: 2.5,
            depth: 0.5,
            wet: 0.4, // Subtelny chorus
        }).start();

        this.delay = new Tone.FeedbackDelay({
            delayTime: "8n",
            feedback: 0.5,
            wet: 0.3,
        });

        this.distortion = new Tone.Distortion({
            distortion: 1, // Lekki przester
            wet: 0.9,
        });

        // ��czenie syntezatora z efektami
        this.synth.chain(this.distortion, this.chorus, this.reverb, this.delay).toDestination();
    }

    playSound(frequency: number, duration: number, time: number) {
        // Odtwarza d�wi�k
        this.synth.triggerAttackRelease(frequency, duration, time);
    }
}
