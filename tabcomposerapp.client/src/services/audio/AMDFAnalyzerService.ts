import * as Tone from 'tone';
import * as PitchFinder from 'pitchfinder'
import { AnalyzerService } from './AnalyzerService';
import { MusicScale } from '../MusicScale';

export class AMDFAnalyzerService extends Tone.Analyser implements AnalyzerService {

    private detectPitch: (signal: Float32Array) => number | null ;

    constructor(amdfSize = 1024, private minFrequency: number= 60, private maxFrequency: number = 1400) {
        super('waveform', amdfSize);
        
        this.detectPitch = PitchFinder.AMDF(
            {
                sampleRate: Tone.getContext().sampleRate,
                minFrequency: this.minFrequency,
                maxFrequency: this.maxFrequency,

                //ratio : 0.8,
                //sensitivity: 0.7

            }
        );
    }

    getDominantFrequency(): number | null {
        const waveform = this.getValue() as Float32Array;
        return this.detectPitch(waveform);
    }

    animatePlot(canvas: HTMLCanvasElement): () => void {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context.');
            return () => { };
        }

        let animationFrameId: number | null = null;
        let dominantFrequency: number | null = null; // Przechowuje dominuj¹c¹ czêstotliwoœæ
        let soundName: string | null = null; // Przechowuje nazwê dŸwiêku

        // Dopasowanie rozdzielczoœci kanwy do jej stylu CSS
        const setCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.floor(width * window.devicePixelRatio);
            canvas.height = Math.floor(height * window.devicePixelRatio);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // Aktualizacja dominuj¹cej czêstotliwoœci w interwa³ach (np. co 100 ms)
        const updateFrequencyInfo = () => {
            const value = this.getDominantFrequency();
            dominantFrequency = value;
            if (value) {
                const sound = MusicScale.getSoundFromFrequency(value);
                soundName = `${sound?.getName()}${sound?.octave}`;
            } else {
                soundName = null;
            }

        };

        setInterval(updateFrequencyInfo, 250); // Aktualizuj co 100 ms

        const draw = () => {
            const waveform = this.getValue(); // Pobieranie danych z waveform
            if (!(waveform instanceof Float32Array)) {
                throw new Error("getValue() must return a Float32Array");
            }

            // Czyszczenie kanwy
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Obliczanie skali dla amplitudy i szerokoœci
            const barWidth = canvas.width / (waveform.length - 1); // Dzielimy przez (length - 1), aby ostatni punkt by³ na koñcu canvasu
            const middle = canvas.height / 2; // Pozycja œrodka, gdzie amplituda = 0

            ctx.beginPath();
            ctx.moveTo(0, middle); // Zaczynamy w po³owie wysokoœci

            for (let i = 0; i < waveform.length; i++) {
                const amplitude = waveform[i];
                const x = i * barWidth; // Skaluje wspó³rzêdn¹ X
                const y = middle + (amplitude * middle); // Skaluje amplitudê wzglêdem wysokoœci

                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke(); // Rysujemy waveform

            // Wyœwietlanie dominuj¹cej czêstotliwoœci w prawym górnym rogu
            if (dominantFrequency !== null) {
                ctx.font = '16px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText(`Dominant Frequency: ${dominantFrequency.toFixed()} Hz`, 0, 20);
                ctx.fillText(`Sound: ${soundName || "N/A"}`, 0, 40);
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };
    }





}