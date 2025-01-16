import * as Tone from 'tone';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface IFFTAnalyzerService extends Tone.ToneAudioNode {
    getDominantFrequency(): number | null;
    animateFrequencyPlot(canvas: HTMLCanvasElement): void;
    connect(destination: Tone.InputNode, outputNum?: number, inputNum?: number): this;
    disconnect(destination?: Tone.InputNode, outputNum?: number, inputNum?: number): this;
}
export class FFTAnalyzerService extends Tone.Analyser implements IFFTAnalyzerService {
    constructor(fftSize = 1024) {
        super('fft', fftSize);
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
    
    animateFrequencyPlot(canvas: HTMLCanvasElement) {

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context.');
            return;
        }

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

            // Ustawienie szerokoœci s³upków jako liczba ca³kowita
            const barWidth = Math.floor(canvas.width / magnitudes.length);
            const adjustedHeight = canvas.height / window.devicePixelRatio;

            for (let i = 0; i < magnitudes.length; i++) {
                const barHeight = Math.max(0, (magnitudes[i] + 120) * 1.5); // Skalowanie
                const x = i * barWidth;
                const y = adjustedHeight - barHeight;

                // Rysowanie s³upka
                ctx.fillStyle = "black";
                ctx.fillRect(x, y, barWidth, barHeight);
            }

            requestAnimationFrame(draw);
        };

        draw();
    }

}
