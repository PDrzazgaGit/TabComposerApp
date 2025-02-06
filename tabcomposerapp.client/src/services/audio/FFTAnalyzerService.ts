import * as Tone from 'tone';
import { AnalyzerService } from './AnalyzerService';
export class FFTAnalyzerService extends Tone.Analyser implements AnalyzerService {

    private binFrequency: number;
    private startEdge: number;
    private endEdge: number;
    private sampleRate: number;
    constructor(fftSize = 1024, private minFrequency: number = 60, private maxFrequency: number = 1400) {
        super('fft', fftSize);
        this.sampleRate = Tone.getContext().sampleRate;
        this.binFrequency = this.sampleRate / (this.size * 2);
        this.startEdge = Math.ceil(this.minFrequency / this.binFrequency);
        this.endEdge = Math.floor(this.maxFrequency / this.binFrequency);
        console.log(this.startEdge, this.endEdge)
    }


    getDominantFrequency(): number | null {
        const magnitudes = this.getValue() as Float32Array;

        let maxIndex = this.startEdge;
        let maxValue = magnitudes[this.startEdge];

        for (let i = this.startEdge; i <= this.endEdge; i++) {
            if (magnitudes[i] > maxValue) {
                maxValue = magnitudes[i];
                maxIndex = i;
            }
        }

        const frequency = (maxIndex * this.sampleRate) / (this.size * 2);

        return maxValue > -Infinity ? frequency : null; // Zwraca dominuj¹c¹ czêstotliwoœæ
    }

    
    animatePlot(canvas: HTMLCanvasElement): () => void {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context.');
            return () => { };
        }

        let animationFrameId: number | null = null;

        // Funkcja ustawiaj¹ca rozmiar kanwy zgodnie z jej stylem CSS
        const setCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.floor(width * window.devicePixelRatio);
            canvas.height = Math.floor(height * window.devicePixelRatio);
            // Resetujemy transformacjê przed ponownym skalowaniem, ¿eby nie mno¿yæ skalowania
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        window.addEventListener("resize", setCanvasSize);
        setCanvasSize(); // Ustaw pocz¹tkowy rozmiar

        const draw = () => {
            const magnitudes = this.getValue(); // Pobieranie danych
            if (!(magnitudes instanceof Float32Array)) {
                throw new Error("getValue() must return a Float32Array");
            }

            // U¿ywamy widocznych rozmiarów kanwy
            const rect = canvas.getBoundingClientRect();
            const visibleWidth = rect.width;
            const visibleHeight = rect.height;

            // Czyszczenie kanwy
            ctx.clearRect(0, 0, visibleWidth, visibleHeight);

            // Obliczanie szerokoœci s³upka na podstawie widocznej szerokoœci
            const totalBars = this.endEdge;
            const barWidth = visibleWidth / totalBars;

            for (let i = this.startEdge; i < this.endEdge; i++) {
                const barHeight = Math.max(0, (magnitudes[i] + 120) * 1.5); // Skalowanie – mo¿esz dostosowaæ
                const x = (i - this.startEdge) * barWidth;
                const y = visibleHeight - barHeight;
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
            }, 1000);
        };
    }


}
