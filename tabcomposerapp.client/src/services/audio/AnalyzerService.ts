import * as Tone from 'tone';
export interface AnalyzerService extends Tone.ToneAudioNode {
    getDominantFrequency(): number | null;
    animatePlot(canvas: HTMLCanvasElement): () => void;
}