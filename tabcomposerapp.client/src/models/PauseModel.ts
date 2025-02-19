import { makeObservable } from "mobx";
import { Note, NoteDuration, NoteKind } from "./";
export interface IPause {
    playing: boolean;
    readonly kind: NoteKind;
    readonly noteDuration: NoteDuration;
    getTimeStampMs(): number;
    getEndTimeStampMs(): number;
    getDurationMs(): number;
    getName(): string;
}

export class Pause extends Note implements IPause {
    public override readonly kind: NoteKind;
    constructor(public noteDuration: NoteDuration = NoteDuration.Quarter, noteDurationMs: number = 500) {
        super(-1, 0, -1, -1, noteDurationMs);
        this.kind = NoteKind.Pause;

        makeObservable(this, {

        })
    }
    public override getName(): string {
        return NoteDuration[this.noteDuration] + "-Pause";
    }

    public override clone(): Pause {
        const pause: Pause = new Pause(this.noteDuration, this.getDurationMs());
        pause.setTimeStampMs(this.getTimeStampMs());
        return pause;
    }

}