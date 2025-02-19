import * as Tone from 'tone';
export interface IAnalyzerService extends Tone.ToneAudioNode {
    readonly minFrequency: number;
    readonly maxFrequency: number;
    getDominantFrequency(): number | null;
    animatePlot(canvas: HTMLCanvasElement): () => void;
}