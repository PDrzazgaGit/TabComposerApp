import {Note, NoteKind, NoteDuration } from "./"
export interface IPause {
    readonly kind: NoteKind;
    readonly noteDuration: NoteDuration;
    getTimeStampMs(): number;
    getEndTimeStampMs(): number;
    getDurationMs(): number;
    getName(): string;
}

export class Pause extends Note implements IPause {
    public override readonly kind: NoteKind;
    constructor(public readonly noteDuration: NoteDuration = NoteDuration.Quarter, noteDurationMs: number = 500) {
        super(-1, 0, -1, -1, noteDurationMs);
        this.kind = NoteKind.Pause;
    }
    public override getName(): string {
        return NoteDuration[this.noteDuration] + "-Pause";
    }
}