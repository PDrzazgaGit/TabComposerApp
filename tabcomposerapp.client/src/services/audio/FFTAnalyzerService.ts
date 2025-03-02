import * as Tone from 'tone';
import { IAnalyzerService } from './';
export class FFTAnalyzerService extends Tone.Analyser implements IAnalyzerService {

    private binFrequency: number;
    private startEdge: number;
    private endEdge: number;
    private sampleRate: number;
    constructor(fftSize = 1024, public minFrequency: number = 60, public maxFrequency: number = 1400) {
        super('fft', fftSize);
        this.sampleRate = Tone.getContext().sampleRate;
        this.binFrequency = this.sampleRate / (this.size * 2);
        this.startEdge = Math.ceil(this.minFrequency / this.binFrequency);
        this.endEdge = Math.floor(this.maxFrequency / this.binFrequency);
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

        return maxValue > -Infinity ? frequency : null; 
    }

    
    animatePlot(canvas: HTMLCanvasElement): () => void {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context.');
            return () => { };
        }

        let animationFrameId: number | null = null;


        const setCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.floor(width * window.devicePixelRatio);
            canvas.height = Math.floor(height * window.devicePixelRatio);
           
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        window.addEventListener("resize", setCanvasSize);
        setCanvasSize();

        const draw = () => {
            const magnitudes = this.getValue(); 
            if (!(magnitudes instanceof Float32Array)) {
                throw new Error("getValue() must return a Float32Array");
            }

      
            const rect = canvas.getBoundingClientRect();
            const visibleWidth = rect.width;
            const visibleHeight = rect.height;

 
            ctx.clearRect(0, 0, visibleWidth, visibleHeight);

  
            const totalBars = this.endEdge;
            const barWidth = visibleWidth / totalBars;

            for (let i = this.startEdge; i < this.endEdge; i++) {
                const barHeight = Math.max(0, (magnitudes[i] + 120) * 1.5); 
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
