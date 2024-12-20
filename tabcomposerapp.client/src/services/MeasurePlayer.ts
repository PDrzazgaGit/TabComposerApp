import { IMeasure } from "../models";
import { NotePlayer } from "./NotePlayer";

export class MeasurePlayer extends NotePlayer {

    public static playMeasure(measure: IMeasure): void {
        this.playMeasureWithStartTime(measure, this.audioContext.currentTime);
    }

    public static playMeasureWithStartTime(measure: IMeasure, startTime: number): void {
        measure.forEach((notes) => {
            for (const note of notes) {
                super.playWithStartTime(note, startTime); // U¿ycie metody z NotePlayer
            }
        });
    }
}
