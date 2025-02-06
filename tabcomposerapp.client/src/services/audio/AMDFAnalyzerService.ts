import * as Tone from 'tone';
import * as PitchFinder from 'pitchfinder'
import { AnalyzerService } from './AnalyzerService';
import { MusicScale } from '../MusicScale';
import { amdf } from './methods/amdf';
//import { YIN } from './methods/YIN';

export class AMDFAnalyzerService extends Tone.Analyser implements AnalyzerService {

    private detectPitch: (signal: Float32Array) => number | null;
   // private yin: YIN;

    constructor(amdfSize = 1024, private minFrequency: number= 60, private maxFrequency: number = 1400) {
        super('waveform', amdfSize);

        //this.yin = new YIN(Tone.getContext().sampleRate, amdfSize, 0);

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
        const pitch = this.detectPitch(waveform)
        return pitch;
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

        // Funkcja ustawiaj¹ca rozmiar kanwy zgodnie z widocznymi wymiarami CSS
        const setCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.floor(width * window.devicePixelRatio);
            canvas.height = Math.floor(height * window.devicePixelRatio);
            // Resetujemy transformacjê i skalujemy kontekst
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        // Ustawiamy pocz¹tkowy rozmiar
        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // Aktualizacja dominuj¹cej czêstotliwoœci w interwa³ach (np. co 250 ms)
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

        setInterval(updateFrequencyInfo, 250);

        const draw = () => {
            const waveform = this.getValue(); // Pobieranie danych z waveform
            if (!(waveform instanceof Float32Array)) {
                throw new Error("getValue() must return a Float32Array");
            }

            // Pobieramy widoczne wymiary kanwy (w CSS pikselach)
            const { width: visibleWidth, height: visibleHeight } = canvas.getBoundingClientRect();

            // Czyszczenie kanwy - u¿ywamy widocznych wymiarów
            ctx.clearRect(0, 0, visibleWidth, visibleHeight);

            // Obliczanie skali dla amplitudy i szerokoœci
            // U¿ywamy d³ugoœci widocznej kanwy (CSS) do rysowania
            const barWidth = visibleWidth / (waveform.length - 1); // Dzielimy przez (length - 1), aby ostatni punkt by³ na koñcu kanwy
            const middle = visibleHeight / 2; // Pozycja œrodka (0 amplitudy)

            ctx.beginPath();
            ctx.moveTo(0, middle); // Zaczynamy od œrodka wysokoœci

            for (let i = 0; i < waveform.length; i++) {
                const amplitude = waveform[i];
                const x = i * barWidth; // Skalowanie wspó³rzêdnej X
                // Amplituda rysowana wzglêdem œrodka – dodatnie wartoœci id¹ w dó³, ujemne w górê
                const y = middle + (amplitude * middle);
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();

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