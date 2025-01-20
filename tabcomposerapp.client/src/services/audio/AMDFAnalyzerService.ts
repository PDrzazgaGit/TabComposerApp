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
        let dominantFrequency: number | null = null; // Przechowuje dominuj�c� cz�stotliwo��
        let soundName: string | null = null; // Przechowuje nazw� d�wi�ku

        // Dopasowanie rozdzielczo�ci kanwy do jej stylu CSS
        const setCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.floor(width * window.devicePixelRatio);
            canvas.height = Math.floor(height * window.devicePixelRatio);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // Aktualizacja dominuj�cej cz�stotliwo�ci w interwa�ach (np. co 100 ms)
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

            // Obliczanie skali dla amplitudy i szeroko�ci
            const barWidth = canvas.width / (waveform.length - 1); // Dzielimy przez (length - 1), aby ostatni punkt by� na ko�cu canvasu
            const middle = canvas.height / 2; // Pozycja �rodka, gdzie amplituda = 0

            ctx.beginPath();
            ctx.moveTo(0, middle); // Zaczynamy w po�owie wysoko�ci

            for (let i = 0; i < waveform.length; i++) {
                const amplitude = waveform[i];
                const x = i * barWidth; // Skaluje wsp�rz�dn� X
                const y = middle + (amplitude * middle); // Skaluje amplitud� wzgl�dem wysoko�ci

                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke(); // Rysujemy waveform

            // Wy�wietlanie dominuj�cej cz�stotliwo�ci w prawym g�rnym rogu
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