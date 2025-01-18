import * as Tone from 'tone';
import PitchFinder from 'pitchfinder'
import { AnalyzerService } from './AnalyzerService';

export class AMDFAnalyzerService extends Tone.Analyser implements AnalyzerService {

    private detectPitch: (signal: Float32Array) => number | null;

    constructor(yinSize = 1024) {
        super('waveform', yinSize);
        this.detectPitch = PitchFinder.AMDF(
            {
                sampleRate: Tone.getContext().sampleRate,
                minFrequency: 63,
                maxFrequency: 1400
                //ratio : 0.8,
                //sensitivity: 0.7
                
            }
        );
    }

    getDominantFrequency(): number | null {
        const waveform = this.getValue() as Float32Array;
        return this.detectPitch(waveform);
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