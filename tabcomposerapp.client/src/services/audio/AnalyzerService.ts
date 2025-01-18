import * as Tone from 'tone';
export interface AnalyzerService extends Tone.ToneAudioNode {
    getDominantFrequency(): number | null;
    animateFrequencyPlot(canvas: HTMLCanvasElement): () => void;
    connect(destination: Tone.InputNode, outputNum?: number, inputNum?: number): this;
    disconnect(destination?: Tone.InputNode, outputNum?: number, inputNum?: number): this;
}