import * as Tone from 'tone';
import { AnalyzerService } from './AnalyzerService';
export class FFTAnalyzerService extends Tone.Analyser implements AnalyzerService {
    constructor(fftSize = 1024, private minFrequency: number = 60, private maxFrequency: number = 1400) {
        super('fft', fftSize);
    }

    findHarmonics(baseFrequency: number): number[] {
        const magnitudes = this.getValue() as Float32Array;
        const sampleRate = Tone.getContext().sampleRate;

        const binFrequency = sampleRate / (this.size * 2);
        const harmonicFrequencies: number[] = [];

        // Przegl¹daj harmoniczne (np. do 10-tej harmonicznej)
        for (let i = 1; i <= 10; i++) {
            const targetFrequency = baseFrequency * i; // Teoretyczna harmoniczna
            if (targetFrequency > this.maxFrequency) break; // Poza analizowanym zakresem

            const targetIndex = Math.round(targetFrequency / binFrequency); // Bin docelowy
            if (targetIndex < magnitudes.length) {
                const amplitude = magnitudes[targetIndex];

                // SprawdŸ, czy amplituda w tym binie jest znacz¹ca
                if (amplitude > -Infinity) {
                    harmonicFrequencies.push(targetFrequency);
                }
            }
        }

        return harmonicFrequencies;
    }

    getDominantFrequency(): number | null {
        const magnitudes = this.getValue() as Float32Array;
        const sampleRate = Tone.getContext().sampleRate;

        const binFrequency = sampleRate / (this.size * 2);
        const minIndex = Math.ceil(this.minFrequency / binFrequency);
        const maxIndexLimit = Math.floor(this.maxFrequency / binFrequency);  // Zmieniam nazwê na maxIndexLimit

        let maxIndex = minIndex; // Pocz¹tkowa wartoœæ dla maxIndex
        let maxValue = magnitudes[minIndex];

        // Szukaj dominuj¹cej czêstotliwoœci w zakresie
        for (let i = minIndex; i <= maxIndexLimit; i++) {
            if (magnitudes[i] > maxValue) {
                maxValue = magnitudes[i];
                maxIndex = i;
            }
        }

        const frequency = (maxIndex * sampleRate) / (this.size * 2);

        return maxValue > -Infinity ? frequency : null; // Zwraca dominuj¹c¹ czêstotliwoœæ
    }
    
    animatePlot(canvas: HTMLCanvasElement): () => void {

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context.');
            return () => { };
        }

        let animationFrameId: number | null = null;

        // Dopasowanie rozdzielczoœci kanwy do jej stylu CSS
        const setCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.floor(width * window.devicePixelRatio);
            canvas.height = Math.floor(height * window.devicePixelRatio);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        const draw = () => {
            const magnitudes = this.getValue(); // Pobieranie danych
            if (!(magnitudes instanceof Float32Array)) {
                throw new Error("getValue() must return a Float32Array");
            }

            // Czyszczenie kanwy
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Obliczanie szerokoœci s³upka bez zaokr¹glania
            const barWidth = canvas.width / magnitudes.length;
            const adjustedHeight = canvas.height / window.devicePixelRatio;

            for (let i = 0; i < magnitudes.length; i++) {
                const barHeight = Math.max(0, (magnitudes[i] + 120) * 1.5); // Skalowanie
                const x = i * barWidth;
                const y = adjustedHeight - barHeight;

                // Rysowanie s³upka
                ctx.fillStyle = "black";
                ctx.fillRect(x, y, barWidth, barHeight);
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            setTimeout(() => {
                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }, 1000)
            
        }
    }

}
