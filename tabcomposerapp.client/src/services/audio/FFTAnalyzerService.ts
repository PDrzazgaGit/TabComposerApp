import * as Tone from 'tone';
import { AnalyzerService } from './AnalyzerService';
export class FFTAnalyzerService extends Tone.Analyser implements AnalyzerService {
    constructor(fftSize = 1024) {
        super('fft', fftSize);
        this.lastFrequencies = [];
    }

    private lastFrequencies: Array<number>;

    getDominantFrequency2(): number | null {
        const magnitudes = this.getValue() as Float32Array;
        const sampleRate = Tone.getContext().sampleRate;
        const lowFreq = 80;
        const highFreq = 1400;

        const binFrequency = sampleRate / (this.size * 2);
        const minIndex = Math.ceil(lowFreq / binFrequency);
        const maxIndexLimit = Math.floor(highFreq / binFrequency);  // Zmieniam nazwê na maxIndexLimit

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

        // SprawdŸ harmoniczne
        for (let i = 2; i <= 5; i++) {
            const harmonicIndex = Math.round((maxIndex / i));
            if (harmonicIndex >= minIndex && magnitudes[harmonicIndex] > maxValue * 0.5) {
                return (harmonicIndex * sampleRate) / (this.size * 2);
            }
        }

        // Wyg³adzenie
        if (!this.lastFrequencies) this.lastFrequencies = [];
        const smoothingFactor = 5;
        this.lastFrequencies.push(frequency);
        if (this.lastFrequencies.length > smoothingFactor) {
            this.lastFrequencies.shift();
        }
        const smoothedFrequency = this.lastFrequencies.reduce((sum, freq) => sum + freq, 0) / this.lastFrequencies.length;

        return maxValue > -Infinity ? smoothedFrequency : null;
    }


    getDominantFrequency(): number | null {
        const magnitudes = this.getValue() as Float32Array;

        let maxIndex = 0;
        let maxValue = magnitudes[0];
        for (let i = 1; i < magnitudes.length; i++) {
            if (magnitudes[i] > maxValue) {
                maxValue = magnitudes[i];
                maxIndex = i;
            }
        }
        const sampleRate = Tone.getContext().sampleRate;
        //console.log(sampleRate)
        const frequency = (maxIndex * sampleRate) / (this.size * 2);

        return maxValue > -Infinity ? frequency : null; // Zwraca dominuj¹c¹ czêstotliwoœæ
    }
    
    animateFrequencyPlot(canvas: HTMLCanvasElement): () => void {

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
