import { IMeasure, ITabulature } from "../models";
import { MeasurePlayer } from "./MeasurePlayer";
/*
export class TabulaturePlayer extends MeasurePlayer {

    constructor(private tabulature: ITabulature) {
        super();
    }

    public playTabulature(): void {
        let currentTime = MeasurePlayer.audioContext.currentTime;

        this.tabulature.forEach((measure) => {
            this.scheduleMeasure(measure, currentTime);
            currentTime += measure.measureDurationMs / 1000;
        });
    }

    private scheduleMeasure(measure: IMeasure, startTime: number): void {
        MeasurePlayer.playMeasureWithStartTime(measure, startTime);
    }
}*/