import * as PitchFinder from 'pitchfinder';
import * as Tone from 'tone';
import { MusicScale } from '../MusicScale';
import { IAnalyzerService } from './';

export class AMDFAnalyzerService extends Tone.Analyser implements IAnalyzerService {

    private detectPitch: (signal: Float32Array) => number | null;

    constructor(amdfSize = 1024, public minFrequency: number= 60, public maxFrequency: number = 1400) {
        super('waveform', amdfSize);

        this.detectPitch = PitchFinder.AMDF(
            {
                sampleRate: Tone.getContext().sampleRate,
                minFrequency: this.minFrequency,
                maxFrequency: this.maxFrequency,

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
        let dominantFrequency: number | null = null; 
        let soundName: string | null = null; 

        const setCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.floor(width * window.devicePixelRatio);
            canvas.height = Math.floor(height * window.devicePixelRatio);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);


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
            const waveform = this.getValue();
            if (!(waveform instanceof Float32Array)) {
                throw new Error("getValue() must return a Float32Array");
            }

            const { width: visibleWidth, height: visibleHeight } = canvas.getBoundingClientRect();


            ctx.clearRect(0, 0, visibleWidth, visibleHeight);

            const barWidth = visibleWidth / (waveform.length - 1); 
            const middle = visibleHeight / 2;

            ctx.beginPath();
            ctx.moveTo(0, middle); 

            for (let i = 0; i < waveform.length; i++) {
                const amplitude = waveform[i];
                const x = i * barWidth; 
             
                const y = middle + (amplitude * middle);
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();

          
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